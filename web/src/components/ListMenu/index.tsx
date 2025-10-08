import { View } from 'react-native';
import { CardMenu, CardMenuProps } from './CardMenu';

export interface ListMenuProps {
  dataMenu: CardMenuProps[];
}

export function ListMenu({ dataMenu }: ListMenuProps) {
  return (
    <View className="flex-row flex-wrap justify-center gap-6 px-6 py-5">
      {dataMenu?.map((card) => (
        <CardMenu key={card.label} {...card} />
      ))}
    </View>
  );
}
