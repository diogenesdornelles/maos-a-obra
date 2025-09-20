import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os


class SinapiDataExtractor:
    def __init__(
        self,
        file_path: str,
        output_path: str,
        sheet_name: str,
        skip_rows: int,
    ) -> None:
        self.file_path = file_path
        self.output_path = output_path
        self.skip_rows = skip_rows
        self.sheet_name = sheet_name
        self.__df: None | pd.DataFrame = None
        self.__execute_etl_pipeline()

    def __execute_etl_pipeline(self):
        """Executa o pipeline completo de ETL"""
        self.__extract_and_transform_data()
        self.__export_to_excel()
        self.__load_to_database()

    def __extract_and_transform_data(self):
        if self.__df is None:
            df = pd.read_excel(
                self.file_path, sheet_name=self.sheet_name, skiprows=self.skip_rows
            )
            df.columns = df.iloc[0]
            df = df.iloc[1:]
            df.reset_index(drop=True, inplace=True)
            df.columns = df.columns.str.replace('\n', ' ')
            if "Classificação" in df.columns:
                df = df[df["Classificação"] == "MATERIAL"].copy()
                if isinstance(df, pd.DataFrame):
                    self.__df = df
                    self.__df.fillna(0.0, inplace=True)
                    return
        raise ValueError(
            "A planilha informada não tem as propriedades necessárias à operação pretendida"
        )

    def __export_to_excel(self):
        if self.__df is not None:
            self.__df.to_excel(self.output_path, index=False, sheet_name="materiais")
            return
        raise ValueError(
            "A planilha informada não tem as propriedades necessárias à operação pretendida"
        )

    def __load_to_database(self):
        if self.__df is not None:
            load_dotenv()
            conn = psycopg2.connect(dsn=os.getenv("DATABASE_URL_PSY"))
            cur = conn.cursor()

            cur.execute("SELECT id, uf FROM estados")
            estados_result = cur.fetchall()
            ufs = {uf: estado_id for estado_id, uf in estados_result}
            print(str(ufs))
            total_precos = 0

            for idx, (_, row) in enumerate(self.__df.iterrows()):
                cur.execute(
                    "INSERT INTO itens (codigo, nomenclatura, unidade) VALUES (%s, %s, %s) RETURNING id",
                    (
                        row["Código do Insumo"],
                        row["Descrição do Insumo"],
                        row["Unidade"],
                    ),
                )
                inserted_id = cur.fetchone()[0]  # type: ignore

                for uf, estado_id in ufs.items():
                    valor = row[
                        uf
                    ]

                    cur.execute(
                        "INSERT INTO precos (item_id, estado_id, valor) VALUES (%s, %s, %s)",
                        (inserted_id, estado_id, valor),
                    )
                    total_precos += 1

            conn.commit()
            cur.close()
            conn.close()

            print(f"Inseridos {len(self.__df)} registros de itens")
            print(f"Inseridos {total_precos} registros de preços")
            return

        raise ValueError("DataFrame não disponível")


if __name__ == "__main__":
    SinapiDataExtractor(
        file_path="./data/SINAPI.xlsx",
        output_path="./out/SINAPI_MATERIAL.xlsx",
        skip_rows=8,
        sheet_name="ISD",
    )
