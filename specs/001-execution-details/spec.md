# Feature Specification: Visualização Gráfica de Instância de Jornada (Execution Details)

**Feature Branch**: `001-execution-details`  
**Created**: 2025-06-24  
**Status**: Draft  
**Input**: User description: "Visualização Gráfica de Instância de Jornada (Execution Details) - Permitir que usuários visualizem o estado atual de uma instância de jornada através de uma representação gráfica do fluxo, reutilizando o mesmo diagrama definido no Journey Designer. A funcionalidade deve fornecer visibilidade operacional sobre a execução da jornada, permitindo identificar rapidamente: Estado atual da execução, Estados já percorridos, Próximos estados possíveis, Histórico de transições, Contexto da execução."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualização Gráfica da Execução (Priority: P1)

Operador de negócio precisa visualizar o estado atual de uma instância de jornada em execução através de um diagrama gráfico que reutiliza a definição da jornada, permitindo identificar rapidamente o estado atual, estados já percorridos e próximos estados possíveis.

**Why this priority**: Esta é a funcionalidade principal do feature - sem a visualização gráfica, o usuário não tem visibilidade operacional da execução. É o valor core que transforma a listagem textual em um cockpit operacional.

**Independent Test**: Pode ser testado independentemente criando uma instância de jornada, navegando para a tela de detalhes e verificando que o diagrama é renderizado com os nós coloridos conforme o estado da execução.

**Acceptance Scenarios**:

1. **Given** que existe uma instância de jornada em execução, **When** o usuário acessa os detalhes da instância, **Then** o sistema deve exibir o diagrama completo da jornada com todos os nós e conexões.
2. **Given** que existem estados já executados, **When** a jornada é renderizada, **Then** os estados concluídos devem aparecer destacados em verde com ícone de sucesso.
3. **Given** que existe um estado atual, **When** a jornada é renderizada, **Then** apenas o estado atual deve aparecer como "Em Execução" com cor azul e destaque visual.
4. **Given** que existem estados ainda não visitados, **When** a jornada é renderizada, **Then** os estados pendentes devem aparecer em cinza.

---

### User Story 2 - Histórico de Transições (Priority: P2)

Operador de negócio precisa visualizar o histórico cronológico de todas as transições ocorridas na instância, incluindo estado origem, estado destino, data/hora e evento responsável, para entender o caminho percorrido pela jornada.

**Why this priority**: O histórico fornece contexto importante sobre como a jornada chegou ao estado atual, mas é secundário à visualização gráfica principal.

**Independent Test**: Pode ser testado independentemente verificando que a timeline de transições é exibida em ordem cronológica crescente com todos os campos necessários.

**Acceptance Scenarios**:

1. **Given** que existem transições registradas, **When** o usuário acessa os detalhes da instância, **Then** o sistema deve exibir o histórico completo em formato de timeline ordenado por data/hora.
2. **Given** que uma transição foi executada, **When** o histórico é exibido, **Then** cada entrada deve mostrar: estado origem, estado destino, data/hora, e evento responsável.

---

### User Story 3 - Contexto da Execução (Priority: P3)

Operador de negócio precisa visualizar as variáveis armazenadas na instância da jornada em formato JSON para entender os dados que estão sendo processados na execução.

**Why this priority**: O contexto é útil para debugging e análise, mas não é essencial para a visibilidade operacional básica.

**Independent Test**: Pode ser testado independentemente verificando que as variáveis da instância são exibidas em formato JSON com suporte a objetos complexos.

**Acceptance Scenarios**:

1. **Given** que a instância possui contexto com variáveis, **When** o usuário acessa os detalhes da instância, **Then** o sistema deve exibir as variáveis em formato JSON.
2. **Given** que o contexto contém objetos JSON complexos, **When** o contexto é exibido, **Then** a visualização deve suportar aninhamento e formatação adequada.

---

### User Story 4 - Informações Gerais da Instância (Priority: P1)

Operador de negócio precisa visualizar informações básicas da instância (ID, definição, versão, status, estado atual, datas) para identificar rapidamente qual jornada está sendo visualizada.

**Why this priority**: As informações gerais são essenciais para identificar a instância e fornecer contexto imediato antes da visualização gráfica.

**Independent Test**: Pode ser testado independentemente verificando que todos os campos de informações gerais são exibidos corretamente.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa os detalhes de uma instância, **When** a página carrega, **Then** o sistema deve exibir: ID da Instância, Journey Definition, Versão da Jornada, Status, Estado Atual, Data de Início, Última Atualização.

---

### Edge Cases

- **What happens when** a instância não possui histórico de transições? **Then** a seção de histórico deve exibir uma mensagem indicando que não há transições registradas.
- **What happens when** a instância não possui contexto (variáveis vazias)? **Then** a seção de contexto deve exibir uma mensagem indicando que não há variáveis armazenadas.
- **What happens when** a jornada definition foi modificada após o início da instância? **Then** o sistema deve renderizar a versão da definição que está associada à instância (journeyVersion).
- **What happens when** a instância está em estado FAILED? **Then** o estado atual deve aparecer em vermelha (preparação para evolução futura).
- **What happens when** o usuário tenta acessar uma instância que não existe? **Then** o sistema deve exibir uma mensagem de erro e redirecionar para a listagem de instâncias.
- **How does system handle** instâncias com histórico muito extenso (milhares de transições)? **Then** o histórico deve suportar paginação para evitar problemas de performance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST exibir informações gerais da instância incluindo: ID da Instância, Journey Definition, Versão da Jornada, Status, Estado Atual, Data de Início, Última Atualização.
- **FR-002**: System MUST renderizar o diagrama da jornada utilizando a definição associada à instância (journeyDefinitionId e journeyVersion).
- **FR-003**: System MUST colorir os nós do diagrama conforme o estado da execução: concluído (verde), em execução (azul), pendente (cinza), falha (vermelho).
- **FR-004**: System MUST exibir ícone de sucesso nos estados concluídos.
- **FR-005**: System MUST aplicar destaque visual no estado atual da execução.
- **FR-006**: System MUST exibir histórico de transições em formato de timeline ordenado cronologicamente por data/hora.
- **FR-007**: System MUST exibir para cada transição: estado origem, estado destino, data/hora, e evento responsável.
- **FR-008**: System MUST exibir contexto da execução em formato JSON com suporte a objetos complexos.
- **FR-009**: System MUST disponibilizar ação "Visualizar Detalhes" na listagem de Journey Instances.
- **FR-010**: System MUST navegar para `/journey-instances/{instanceId}` ao selecionar a ação de visualizar detalhes.
- **FR-011**: System MUST suportar paginação no histórico de transições para instâncias com histórico extenso.
- **FR-012**: System MUST exibir mensagem apropriada quando não há histórico de transições.
- **FR-013**: System MUST exibir mensagem apropriada quando não há contexto/váriáveis na instância.
- **FR-014**: System MUST exibir mensagem de erro e redirecionar para listagem ao acessar instância inexistente.

### Key Entities *(include if feature involves data)*

- **JourneyInstance**: Representa uma execução de jornada com atributos: instanceId, journeyDefinitionId, journeyVersion, currentState, status, createdAt, updatedAt, context (Map<String, Object>), history (lista de transições).
- **TransitionHistoryEntry**: Representa uma transição executada com atributos: id, instanceId, fromState, toState, event, timestamp, metadata.
- **JourneyDefinition**: Representa a definição da jornada utilizada para renderizar o diagrama com atributos: id, journeyCode, name, version, states, transitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários conseguem identificar o estado atual de uma instância de jornada em menos de 5 segundos ao acessar a tela de detalhes.
- **SC-002**: A visualização gráfica carrega completamente em menos de 3 segundos para jornadas com até 50 estados.
- **SC-003**: 95% dos usuários conseguem navegar da listagem para os detalhes de uma instância sem necessidade de assistência.
- **SC-004**: A redução de tempo para identificar o estado de execução é de 80% comparado à visualização textual atual (estimado de 30 segundos para 5 segundos).
- **SC-005**: O histórico de transições suporta instâncias com até 1000 transições sem degradação de performance perceptível.

## Assumptions

- **Usuários**: Operadores de negócio e analistas de processo têm acesso à aplicação e permissão para visualizar instâncias de jornada.
- **Escopo**: A funcionalidade é exclusivamente de observabilidade e monitoramento, sem capacidades de modificação da execução (cancelamento, reprocessamento, avanço manual).
- **Dados**: A API backend já fornece os dados necessários: JourneyInstance com contexto e histórico, JourneyDefinition com estados e transições, e TransitionHistory com detalhes das transições.
- **Tecnologia**: O frontend já utiliza React Flow para o editor visual, e a mesma biblioteca será reutilizada para a visualização da execução.
- **Navegação**: A rota `/journey-instances/{instanceId}` será nova e não conflitará com rotas existentes.
- **Performance**: O backend suporta paginação no endpoint de histórico de transições para lidar com históricos extensos.
- **Versão de Definição**: A instância armazena a versão da definição utilizada (journeyVersion), permitindo renderizar a versão correta mesmo que a definição tenha sido modificada.
- **Estado Visual**: Os estados visuais (cores, ícones) seguirão o padrão estabelecido: verde para concluído, azul para em execução, cinza para pendente, vermelho para falha.
