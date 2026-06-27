/**
 * Execution state types for journey instance visualization
 */

export type ExecutionNodeStatus = 'COMPLETED' | 'RUNNING' | 'PENDING' | 'FAILED'

export interface ExecutionNodeState {
  stateName: string
  executionStatus: ExecutionNodeStatus
  visitedAt?: string // ISO 8601 timestamp when state was first visited
}

export interface ExecutionFlowViewerProps {
  definition: any // JourneyDefinitionResponse - will be typed from API
  executionNodeStates: Map<string, ExecutionNodeState>
}

export interface ExecutionInfoPanelProps {
  instance: any // JourneyInstanceResponse - will be typed from API
  definition: any // JourneyDefinitionResponse - will be typed from API
}

export interface ExecutionHistoryTimelineProps {
  history: any[] // TransitionHistoryEventResponse[] - will be typed from API
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export interface ExecutionContextViewerProps {
  context: Record<string, any> | null
}
