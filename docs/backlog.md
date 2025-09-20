# Backlog do produto

## Plano de Release

Premissas:
- Sprints de 2 semanas iniciando em 12/09/2025.
- R1 (24/10/2025): Máximo possível de backend + cadastrar e login no app (apenas autenticação no mobile).
- R2 (28/11/2025): Backend completo + telas funcionais principais do mobile (projetos + itens + consultas básicas).
- Web Admin permanece pós-R2.

### Estratégia de Prioridade (MOSCOW)
- Must (M): Necessário até R2.
- Should (S): Se couber até R2 sem risco.
- Could (C): Pós-R2.
- Won’t (W): Explicitamente fora.

### Objetivos principais por Release
- Release 1 - Backend completo e preparação ao frontend:
    - Elicitação de requisitos funcionais referentes aos módulos Usuários, Estados, Municípios, Bairros, Itens, Preços, Clientes, Endereços, Projetos, Projeto-Itens;
    - Elicitação de requisitos não funcionais;
    - Dockerização via compose;
    - Definição de regras de negócios;
    - wireframes de telas mobile e definições UX;
    - Definição de arquitetura do sistema (módulos api, infra e web);
    - Modelagem do sistema;
    - Setup do backend;
    - Design, configuração e implementação do banco de dados via ORM;
    - Setup do módulo infra;
    - Seeds (Estados, Municípios, Bairros, Itens, Preços);
    - Definição geral de Auth / Autho / Usuários / Clientes (JWT, roles, guards);
    - CRUD: Preços, Clientes, Endereços, Projetos, Projeto-Itens;
    - CRUD: Usuários, Estados, Municípios, Bairros, Itens;
    - Busca /search com paginação e ordenação;
    - Trigger snapshot preço + cálculo valor_total item e agregação projeto;
    - Regras status (CONCLUIDO exige item; CANCELADO bloqueia mutações);
    - Swagger + Documentação;
    - Testes núcleo unit/e2e + logging básico;
- Release 2 - Mobile completo e refino backend:
    - Fluxos: Login / Cadastro / Logout / Não logado;
    - Usuário cadastrar e excluir;
    - Endereços listar;
    - Endereços criar, editar, excluir;
    - Clientes listar;
    - Clientes criar, editar, excluir;
    - Projetos listar;
    - Projetos criar, editar, excluir;
    - Projeto-Itens adicionar, editar quantidade, remover;
    - Consultas de Itens (por nomenclatura + estado + preço);
    - UX mínima, tratamento de erros, testes de integração app–API;
    - Consolidação dos documentos gerados no projeto;


 **Sprint** | **Atividade**                                                                                                                                                   | **Responsável**          | **Data início** | **Dia semana 1** | **Previsão fim** | **Dia semana 2** | **Número dias previstos** | **Data fim** | **Número de dias efetivos** | **Concluído** | **Status** | **Recursos** | **Prioridade** 
------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|-----------------|------------------|------------------|------------------|---------------------------|--------------|-----------------------------|---------------|------------|--------------|----------------
 **S1**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 15/09/2025      | segunda\-feira   | 15/09/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S1**     | Elicitação de requisitos funcionais referentes aos módulos Usuários, Estados, Municípios, Bairros, Itens, Preços, Clientes, Endereços, Projetos, Projeto\-Itens | Paulo José Onofre Dutra  | 15/09/2025      | segunda\-feira   | 19/09/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S1**     | Elicitação de requisitos não funcionais                                                                                                                         | Paulo José Onofre Dutra  | 15/09/2025      | segunda\-feira   | 19/09/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S1**     | Definição de regras de negócios                                                                                                                                 | Paulo José Onofre Dutra  | 15/09/2025      | segunda\-feira   | 19/09/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S1**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 22/09/2025      | segunda\-feira   | 22/09/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S1**     | Wireframes de telas mobile e definições UX                                                                                                                      | Rebeka Moraes Alanis     | 22/09/2025      | segunda\-feira   | 26/09/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P1             
 **S1**     | Definição de arquitetura do sistema \(módulos api, infra e web\)                                                                                                | José Lima Fontoura       | 22/09/2025      | segunda\-feira   | 26/09/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S1**     | Modelagem do sistema                                                                                                                                            | José Lima Fontoura       | 22/09/2025      | segunda\-feira   | 26/09/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S2**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 29/09/2025      | segunda\-feira   | 29/09/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S2**     | Setup do backend                                                                                                                                                | José Lima Fontoura       | 29/09/2025      | segunda\-feira   | 03/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S2**     | Design, configuração e implementação do banco de dados via ORM                                                                                                  | José Lima Fontoura       | 29/09/2025      | segunda\-feira   | 03/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S2**     | Setup do módulo infra                                                                                                                                           | José Lima Fontoura       | 29/09/2025      | segunda\-feira   | 03/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S2**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 06/10/2025      | segunda\-feira   | 06/10/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S2**     | Seeds \(Estados, Municípios, Bairros, Itens, Preços\)                                                                                                           | José Lima Fontoura       | 06/10/2025      | segunda\-feira   | 10/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S2**     | Definição geral de Auth / Autho / Usuários / Clientes \(JWT, roles, guards\)                                                                                    | José Lima Fontoura       | 06/10/2025      | segunda\-feira   | 10/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S2**     | CRUD: Preços, Clientes, Endereços, Projetos, Projeto\-Itens                                                                                                     | Felipe Souza Moré        | 06/10/2025      | segunda\-feira   | 10/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S2**     | CRUD: Usuários, Estados, Municípios, Bairros, Itens                                                                                                             | Daniel Nunes Augusto     | 06/10/2025      | segunda\-feira   | 10/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S3**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 13/10/2025      | segunda\-feira   | 13/10/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S3**     | Busca /search com paginação e ordenação                                                                                                                         | Felipe Souza Moré        | 13/10/2025      | segunda\-feira   | 17/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S3**     | Trigger snapshot preço \+ cálculo valor\_total item e agregação projeto                                                                                         | José Lima Fontoura       | 13/10/2025      | segunda\-feira   | 17/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S3**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 20/10/2025      | segunda\-feira   | 20/10/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S3**     | Regras status \(CONCLUIDO exige item; CANCELADO bloqueia mutações\)                                                                                             | Felipe Souza Moré        | 20/10/2025      | segunda\-feira   | 24/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S3**     | Swagger \+ Documentação                                                                                                                                         | José Lima Fontoura       | 20/10/2025      | segunda\-feira   | 24/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S3**     | Testes núcleo unit/e2e \+ logging básico                                                                                                                        | Felipe Souza Moré        | 20/10/2025      | segunda\-feira   | 24/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P2    
 **S3**     | Dockerização via compose infra,api                                                                                                                        | José Lima Fontoura       | 20/10/2025      | segunda\-feira   | 24/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P2              
 **R1**     | Backend completo, testes e preparação ao frontend                                                                                                               | Paulo José Onofre Dutra  | 24/10/2025      | sexta\-feira     | 24/10/2025       | sexta\-feira     | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S4**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 27/10/2025      | segunda\-feira   | 27/10/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S4**     | Fluxos: Login / Cadastro / Logout / Não logado                                                                                                                  | Felipe Souza Moré        | 27/10/2025      | segunda\-feira   | 31/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S4**     | Usuário cadastrar e excluir                                                                                                                                     | Daniel Nunes Augusto     | 27/10/2025      | segunda\-feira   | 31/10/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S4**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 03/11/2025      | segunda\-feira   | 03/11/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S4**     | Endereços listar                                                                                                                                                | Felipe Souza Moré        | 03/11/2025      | segunda\-feira   | 07/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S4**     | Endereços criar, editar, excluir                                                                                                                                | Daniel Nunes Augusto     | 03/11/2025      | segunda\-feira   | 07/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S5**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 10/11/2025      | segunda\-feira   | 10/11/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S5**     | Clientes listar                                                                                                                                                 | Felipe Souza Moré        | 10/11/2025      | segunda\-feira   | 14/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S5**     | Clientes criar, editar, excluir                                                                                                                                 | Daniel Nunes Augusto     | 10/11/2025      | segunda\-feira   | 14/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S5**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 17/11/2025      | segunda\-feira   | 17/11/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S5**     | Projetos listar                                                                                                                                                 | Felipe Souza Moré        | 17/11/2025      | segunda\-feira   | 21/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S5**     | Projetos criar, editar, excluir                                                                                                                                 | Daniel Nunes Augusto     | 17/11/2025      | segunda\-feira   | 21/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S6**     | Reunião semanal                                                                                                                                                 | Diógenes Dornelles Costa | 24/11/2025      | segunda\-feira   | 24/11/2025       | segunda\-feira   | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P2             
 **S6**     | Projeto\-Itens adicionar, editar quantidade, remover                                                                                                            | Felipe Souza Moré        | 24/11/2025      | segunda\-feira   | 28/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S6**     | Consultas de Itens \(por nomenclatura \+ estado \+ preço\)                                                                                                      | Daniel Nunes Augusto     | 24/11/2025      | segunda\-feira   | 28/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S6**     | UX mínima, tratamento de erros, testes de integração app–API                                                                                                    | Felipe Souza Moré        | 24/11/2025      | segunda\-feira   | 28/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S6**     | Consolidação dos documentos gerados no projeto                                                                                                                  | José Lima Fontoura       | 24/11/2025      | segunda\-feira   | 28/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P3             
 **S6**     | Deploy dos módulos em nuvem                                                                                                                                     | José Lima Fontoura       | 24/11/2025      | segunda\-feira   | 28/11/2025       | sexta\-feira     | 5                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **R2**     | Mobile completo e refino backend                                                                                                                                | Paulo José Onofre Dutra  | 28/11/2025      | sexta\-feira     | 28/11/2025       | sexta\-feira     | 1                         |              |                             | 0%            | Pendente   | \#REF\!      | P4             
 **S7\+**   | Expansões \| Web Admin, Relatórios, RBAC avançado, Offline, Push \| Iterativo \| José Lima Fontoura \(Tech Lead\) \| Backlog evolutivo                          | Equipe                   | 01/12/2025      | segunda\-feira   | 31/05/2026       | domingo          | 182                       |              |                             | 0%            | Pendente   |              | P1             



LINK: 

[Link planilha drive](https://docs.google.com/spreadsheets/d/1-OhFYz5Q2LGhCX0FNuuoYeaqajUq4bVbzIIV1OK24cI/edit?usp=sharing)

### Escopo por Domínio

| Domínio | Até R1 | R1→R2 | Pós-R2 |
| ------- | ------ | ----- | ------ |
| Backend (todos módulos) | 100% completo | Manutenção / bugfix | Evoluções / relatórios |
| Cálculo & Snapshot | Implementado (itens + agregação projeto) | Estabilização | Simulações / cenários |
| Auth / Segurança | JWT + roles + guards + rate limit | Melhoria UX erros | RBAC avançado / auditoria |
| Testes Backend | Núcleo (≥50%) | Aumentar cobertura integração | Performance / carga |
| Mobile | Login inicial | CRUD completo & consultas | Offline / push / UX |
| Observabilidade | Logs básicos | Refinar logs/metrics leves | APM / tracing |
| Export/Relatórios | — | Planejamento | Implementação |
| Web Admin | — | Planejamento | Execução |

### Backlog Priorizado

1. Auth + Usuários
2. Seeds Geo
3. Itens & Preços
4. Clientes & Endereços
5. Projetos + Projeto-Itens (CRUD + cálculo + regras)
6. Busca /search geral
7. Swagger + Docs
8. Testes núcleo + logs + segurança (hardening)
9. Mobile: infra + auth
10. Mobile: Projetos / Itens CRUD
11. Mobile: Clientes / Endereços / Consultas
12. Testes integração mobile
13. Polimento / performance / UX
14. Export / Relatórios
15. Web Admin / RBAC avançado / Offline

### Marcos de Release

| Release | Data | Conteúdo | Critérios |
| ------- | ---- | -------- | -------- |
| R1 | 24/10/2025 | Backend completo e estável | Todos CRUDs + cálculo + regras status + docs + testes núcleo |
| R2 | 28/11/2025 | Mobile completo sobre backend estável | Fluxos mobile CRUD + consultas + testes integração |


### Riscos & Mitigações

| Risco | Mitigação |
| ----- | --------- |
| Atraso cálculo antes R1 | Concluir cálculo S2; reservar buffer S3 |
| Mobile subestima esforço CRUD | Sequenciar fundação (S4) antes de CRUD (S5) |
| Baixa cobertura testes backend | Planejar mínimos críticos em S3 |
| Scope creep pós-R1 | Congelar mudanças de modelo até R2 |

### Pós-R2 (Backlog Futuro)
- Export / Relatórios
- Web Admin
- RBAC avançado
- Composições SINAPI
- Offline / Push
- Auditoria detalhada
- Importação em massa
- Simulações de cenário