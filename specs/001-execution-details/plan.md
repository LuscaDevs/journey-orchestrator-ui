# Implementation Plan: Visualização Gráfica de Instância de Jornada (Execution Details)

**Branch**: `001-execution-details` | **Date**: 2025-06-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-execution-details/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Adicionar tela de detalhes de instância de jornada com visualização gráfica do fluxo utilizando React Flow, reutilizando a definição da jornada. A funcionalidade exibirá informações gerais da instância, diagrama com nós coloridos conforme estado da execução (concluído/verde, em execução/azul, pendente/cinza, falha/vermelho), histórico de transições em timeline, e contexto da execução em JSON. A rota será `/journey-instances/{instanceId}` acessível a partir da listagem de Journey Instances.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.2.4
**Primary Dependencies**: React Flow 11.11.4 (visualização), Zustand 5.0.12 (state management), React Router DOM 7.14.0 (navegação), TailwindCSS 4.2.0 (styling)
**Storage**: MongoDB (backend) - API REST fornece dados de JourneyInstance, JourneyDefinition, TransitionHistory
**Testing**: Vitest 4.1.2, React Testing Library 16.3.2
**Target Platform**: Web browser (moderno)
**Project Type**: web-service (frontend React + backend Spring Boot)
**Performance Goals**: Visualização gráfica carrega em < 3s para jornadas com até 50 estados; Identificação de estado em < 5s
**Constraints**: API backend já fornece dados necessários; Reutilizar React Flow do editor visual; Apenas observabilidade (sem modificação de execução)
**Scale/Scope**: Suporta instâncias com até 1000 transições no histórico; Jornadas com até 50 estados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASSED - No constitution gates defined (constitution.md is a template placeholder)
**Notes**: Project does not have a ratified constitution with specific gates to enforce

**Post-Design Re-evaluation**: PASSED - No additional violations introduced by design decisions. All design choices align with existing project patterns (React Flow reuse, existing API endpoints, standard React patterns).

## Project Structure

### Documentation (this feature)

```text
specs/001-execution-details/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── JourneyInstanceDetailsPage.tsx      # New page for instance details
├── components/
│   ├── execution/
│   │   ├── ExecutionFlowViewer.tsx         # React Flow viewer for execution
│   │   ├── ExecutionInfoPanel.tsx          # General info panel
│   │   ├── ExecutionHistoryTimeline.tsx    # Transition history timeline
│   │   └── ExecutionContextViewer.tsx      # JSON context viewer
│   └── ui/
│       └── (existing UI components)
├── hooks/
│   └── useJourneyInstanceDetails.ts        # Hook for instance details data
├── services/
│   └── journeyInstanceService.ts           # (may need updates)
├── types/
│   └── journeyInstance.types.ts            # (may need updates)
└── App.tsx                                 # (add new route)

tests/
├── unit/
│   ├── components/
│   │   └── execution/
│   │       ├── ExecutionFlowViewer.test.tsx
│   │       ├── ExecutionHistoryTimeline.test.tsx
│   │       └── ExecutionContextViewer.test.tsx
│   └── hooks/
│       └── useJourneyInstanceDetails.test.ts
└── integration/
    └── JourneyInstanceDetailsPage.test.tsx
```

**Structure Decision**: Web application structure (frontend React). New components added under `src/components/execution/` for execution-specific UI, new page under `src/pages/`, new hook under `src/hooks/`. Tests follow existing structure with unit tests for components/hooks and integration tests for the page.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
