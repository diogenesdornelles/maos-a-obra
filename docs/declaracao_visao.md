# Declaração de Visão do Projeto “Mãos à obra APP”

## 1. Título
- Mãos à obra APP

## 2. Objetivo
- Ser a plataforma móvel (para o cliente) e web (para os administradores) de referência para elaboração de orçamentos de obras no Brasil, oferecendo acesso rápido a preços baseados no SINAPI, gestão de projetos e itens reutilizáveis, para que equipes técnicas e clientes tomem decisões financeiras seguras e transparentes. A previsão de entrega é de 180 dias, gastando R$90.000,00.

## 3. Justificativa
Fornecer ao cliente uma plataforma mobile que permite criar, organizar e atualizar orçamentos de obras de construção civil com rapidez e precisão, reutilizando itens, preços regionais (base SINAPI) e estrutura de projetos para apoiar decisões técnicas e financeiras.

Nossas justificativas são:

- Problema: Orçamentos são lentos, dispersos em planilhas, sujeitos a erros manuais e difícil rastreabilidade de premissas.
- Necessidade: Centralizar cadastros (itens, preços, clientes, projetos) e automatizar o cálculo do custo total.
- Benefício principal: Redução de tempo na geração de orçamentos e aumento da confiabilidade dos valores usados em negociação.
- Público-alvo: Engenheiros, orçamentistas, pequenas construtoras, órgãos públicos e prestadores.
- Diferenciais: Integração estruturada de dados SINAPI, histórico por estado, composição rápida de projetos e exportação futura de relatórios.
- Alinhamento estratégico: Aumenta eficiência operacional e padroniza processos de orçamento para futura escalabilidade comercial.
- Riscos mitigados: Inconsistência de dados (validação/whitelist), perda de histórico (persistência estruturada), divergência de preços regionais (vínculo estado/preço), grande volume de dados originados dos relatórios, latência, grande fluxo de dados, imprecisões nas migrações.
- Métricas iniciais de sucesso (MVP):
	- Criar 1 orçamento completo em <10 minutos.
	- Precisão percebida >=80% em testes piloto.
	- ≥3 projetos ativos por usuário após 30 dias.
	- Tempo médio de resposta API <500 ms nos endpoints CRUD.

## 4. Descrição Geral

Plataforma (API + web + mobile) para criação e gestão de orçamentos de obras de construção civil utilizando dados estruturados (base SINAPI e cadastros próprios) para:
- Centralizar itens, preços regionais, clientes e projetos
- Montar rapidamente composições de projeto e calcular custo total
- Reduzir erros de planilhas manuais e garantir rastreabilidade
- Apoiar decisões técnicas e financeiras com dados consistentes

Escopo MVP:
- Autenticação JWT
- CRUD de usuários, clientes, endereços, estados, municípios, bairros, itens, preços, projetos e itens de projeto
- Cálculo do custo total do projeto via soma (quantidade * preço vigente por estado)
- Relatório simples (futuro) exportável

Subdivisão de módulos:

API: Fornecer registros de usuários, clientes, endereços, estados, municípios, bairros, itens, preços, projetos e itens de projeto

WEB: Ser a plataforma voltada aos administradores do sistema, possibilitando-lhes que gerenciem de forma qualificada.

MOBILE: Ser a plataforma com o qual o público-alvo principal vai atuar, nas funcionalidades descritas no item 3. do presente documento.

## 5. Equipe
| Nome | Papel | Competências
| ----- | --------- | ---- |
Diógenes Dornelles Costa | Scrum Master | Liderança |
Paulo Onofre Dutra | Dono do Produto | Visão estratégica |
Felipe Souza Moré | Programador | Full Stack ReactJS/RN/NodeJS
Daniel Nunes Augusto | Programador | Full Stack ReactJS/RN/NodeJS
José Lima Fontoura | Tech Lead | DBA/Python/Full Stack ReactJS/RN/NodeJS
Rebeka Moraes Alanis | Designer UI/UX | Figma

## 6. Partes Interessadas

| Nome | Descrição | 
| ----- | --------- |
| Scrum Master | Remove impedimentos, garante aderência ao framework.
| Usuários Primários (engenheiros/orçamentistas) | Criam e revisam orçamentos diariamente. |
Product Owner | Define prioridades, maximiza valor do backlog |
Dio Sistemas | Empresa responsável pelo desenvolvimento do sistema
Equipe do projeto | Interessada em obter êxito no projeto para abrir novas oportunidades para a equipe como um todo e também obter crescimento individual de cada membro do time.

## 7. Premissas

- Dados SINAPI disponíveis publicamente e atualizados periodicamente (mensal).
- Base de preços por estado suficiente para estimativas iniciais (não inclui composições 	completas avançadas no MVP).
- Usuário autenticado (JWT) para qualquer operação de escrita.
- Operações CRUD são dominantes; cálculos complexos limitados ao custo total (quantidade * preço vigente).
- Infra de banco única (PostgreSQL) compartilhada por API e pipeline de carga.
- Volume inicial baixo (até alguns milhares de registros por entidade) sem necessidade de sharding.
- Front web/mobile reutiliza a mesma API REST.
- Senhas sempre armazenadas com hash (bcrypt).
- Migrações e seeds controlados via Prisma e scripts Python para dados externos.
- Exportações de relatório podem ser simples (JSON/CSV) no MVP; PDF fica para fase posterior.
- Suporte multi-ambiente (dev e futura prod) via variáveis de ambiente (.env).
- LGPD: somente dados pessoais mínimos necessários (nome, email, CPF/CNPJ se exigido para orçamento).
- Escopo MVP não contempla autorização final por perfil (apenas usuário autenticado).
- Disponibilidade alvo inicial: horário comercial (não HÁ completa).
- Hospedagem de dados (vercel) e banco de dados em nuvem (AWS ou Azure)

## 8. Restrições

- O sistema deverá ser 100% online.
- O projeto terá de ser realizado no máximo em 24 dias após a data de início ainda a ser formalizada.
- O projeto não pode custar mais de R$90.000,00, pois este é o total de dinheiro que pode ser investido.

## 9. Escopo excluído

Por ora, não se incluem no escopo do presente projeto:

- Relatórios avançados (PDF, gráficos detalhados, BI).
- Composições completas automatizadas do SINAPI (foco apenas em itens e preços simples).
- Controle de perfis/roles avançado (RBAC granular, permissões por recurso).
- Multi-tenant / white-label.
- Fluxos de recuperação de senha, auto-registro público e convite por email.
- Notificações push / e-mail transacionais.
- Upload e gestão de anexos (imagens, planilhas, documentos).
- Auditoria detalhada ( trilha completa de alterações campo a campo).
- Integrações externas (ERP, emissão de NF, gateways de pagamento).
- Sincronização offline e cache local robusto.
- Internacionalização (i18n) e multi-moeda.
- Dashboard analítico avançado / KPIs visuais.
- Importação / exportação massiva via planilhas (além de CSV simples futuro).
- Escalabilidade multi-região / clusterização avançada.
- Mecanismo de aprovações em múltiplos estágios de orçamento.
- Chat/suporte interno embutido.
- Testes de carga e hardening de segurança avançado (apenas práticas básicas no MVP).

## 10. Riscos Preliminares

| Risco | Descrição | Impacto | Prob. | Estratégia (Mitigação / Contingência) |
| ----- | --------- | ------- | ----- | ------------------------------------- |
| Qualidade dos dados SINAPI | Formatos variam entre versões ou planilhas incompletas | Erros de preço | Média | Validar schema antes de importar; log de rejeições; fallback última versão válida |
| Atraso atualização preços | Demora em atualizar tabela de preços estaduais | Orçamentos desatualizados | Alta | Agendar job mensal; alerta se versão >30 dias |
| Crescimento volume (cidades/bairros) | Cargas grandes afetam tempo de seed e consultas | Lentidão consultas | Média | Índices em FK e campos de busca; paginação obrigatória |
| Cálculo de custo incorreto | Lógica simples não contempla composições futuras | Decisão errada | Média | Isolar serviço de cálculo; testes unitários; flag para versão futura de engine |
| Segurança (exposição API) | Endpoints sem rate limit ou logs | Abuso / brute force | Média | Rate limit básico (ex: 100/min/IP) e audit log mínimo |
| Vazamento de credenciais | Senhas fracas ou .env exposto | Incidente segurança | Baixa | Bcrypt + política de não commit .env + secrets via ambiente |
| Migrações inconsistentes | Alterações manuais fora do Prisma | Quebra em prod | Média | Processo único via prisma migrate + revisão em PR |
| Falhas seed Python | Script quebra no meio e deixa dados parciais | Inconsistência | Média | Transações por lote; registro de checkpoint; rerun idempotente |
| Latência em ambiente futuro | Sem caching em endpoints de leitura alta | UX degradada | Baixa | Medir p95; adicionar cache em lista de preços futuramente |
| Dependência pessoa-chave | Conhecimento concentrado (infra ou cálculo) | Atrasos | Média | Documentar pipelines e decisões no /docs |
| Falta de testes críticos | Cobertura baixa em auth e cálculo | Regressões | Alta | Priorizar testes unitários + e2e mínimos no MVP |
| Erros silenciosos (pipeline) | Falta de observabilidade | Dados incorretos | Média | Logs estruturados + alerta em falha de job |
| Escopo inflar (scope creep) | Inclusão de features fora MVP | Atraso release | Alta | Product backlog priorizado + definição explícita escopo excluído |
| Falta de rollback rápido | Deploy sem versionamento claro | Downtime | Baixa | Tags semver + script de rollback de container |
| Quebra mobile por mudança API | Alterações sem versionamento | App inválido | Média | Evitar breaking changes ou introduzir /v1 antes de mudanças profundas |

