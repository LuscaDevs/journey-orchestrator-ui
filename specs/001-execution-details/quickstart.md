# Quickstart: Visualização Gráfica de Instância de Jornada (Execution Details)

**Feature**: 001-execution-details  
**Date**: 2025-06-24

## Prerequisites

- Backend API running at `http://localhost:8080`
- At least one JourneyDefinition created and active
- At least one JourneyInstance running or completed
- Frontend development server running

## Setup

### 1. Branch Checkout

```bash
git checkout 001-execution-details
```

### 2. Install Dependencies

Dependencies are already installed in the project. No new dependencies required.

### 3. Backend Setup

Ensure the backend is running with the following endpoints available:
- `GET /journey-instances/{instanceId}` - Get instance details
- `GET /journeys/{id}` - Get journey definition
- `GET /journey-instances/{instanceId}/history` - Get transition history

### 4. Frontend Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Workflow

### 1. Create the Hook

Create `src/hooks/useJourneyInstanceDetails.ts`:

```typescript
import { useState, useEffect } from 'react'
import { JourneyInstancesApi } from '../api/apis/journey-instances-api'
import { JourneyDefinitionsApi } from '../api/apis/journey-definitions-api'
import { JourneyInstanceHistoryApi } from '../api/apis/journey-instance-history-api'
import type { JourneyInstanceResponse, JourneyDefinitionResponse, TransitionHistoryEventResponse } from '../api/models'

export function useJourneyInstanceDetails(instanceId: string) {
  const [data, setData] = useState({
    instance: null as JourneyInstanceResponse | null,
    definition: null as JourneyDefinitionResponse | null,
    history: [] as TransitionHistoryEventResponse[],
    executionNodeStates: new Map<string, ExecutionNodeState>()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [historyOffset, setHistoryOffset] = useState(0)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)

  useEffect(() => {
    fetchData()
  }, [instanceId])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch instance
      const instancesApi = new JourneyInstancesApi()
      const instance = await instancesApi.getJourneyInstance(instanceId)

      // Fetch definition
      const definitionsApi = new JourneyDefinitionsApi()
      const definition = await definitionsApi.getJourneyDefinitionById(instance.journeyDefinitionId)

      // Fetch history
      const historyApi = new JourneyInstanceHistoryApi()
      const historyResponse = await historyApi.getJourneyInstanceHistory(instanceId, {
        limit: 50,
        offset: 0
      })

      // Derive execution node states
      const executionNodeStates = deriveExecutionNodeStates(instance, historyResponse.events || [])

      setData({
        instance,
        definition,
        history: historyResponse.events || [],
        executionNodeStates
      })
      setHasMoreHistory(historyResponse.pagination?.hasNext || false)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch instance details')
    } finally {
      setLoading(false)
    }
  }

  const loadMoreHistory = async () => {
    try {
      const historyApi = new JourneyInstanceHistoryApi()
      const historyResponse = await historyApi.getJourneyInstanceHistory(instanceId, {
        limit: 50,
        offset: historyOffset + 50
      })

      setData(prev => ({
        ...prev,
        history: [...prev.history, ...(historyResponse.events || [])]
      }))
      setHistoryOffset(prev => prev + 50)
      setHasMoreHistory(historyResponse.pagination?.hasNext || false)
    } catch (err: any) {
      console.error('Failed to load more history:', err)
    }
  }

  return { data, loading, error, refetch: fetchData, loadMoreHistory, hasMoreHistory }
}

function deriveExecutionNodeStates(
  instance: JourneyInstanceResponse,
  history: TransitionHistoryEventResponse[]
): Map<string, ExecutionNodeState> {
  const states = new Map<string, ExecutionNodeState>()
  const visitedStates = new Set<string>()

  // Mark visited states from history
  history.forEach(entry => {
    visitedStates.add(entry.toState)
  })

  // Determine status for each state in definition
  // (This would be implemented based on the definition's states)
  // For each state in definition:
  // - if state === instance.currentState: RUNNING
  // - else if visitedStates.has(state): COMPLETED
  // - else: PENDING

  return states
}
```

### 2. Create the Page

Create `src/pages/JourneyInstanceDetailsPage.tsx`:

```typescript
import { useParams, useNavigate } from 'react-router-dom'
import { useJourneyInstanceDetails } from '../hooks/useJourneyInstanceDetails'
import { ExecutionFlowViewer } from '../components/execution/ExecutionFlowViewer'
import { ExecutionInfoPanel } from '../components/execution/ExecutionInfoPanel'
import { ExecutionHistoryTimeline } from '../components/execution/ExecutionHistoryTimeline'
import { ExecutionContextViewer } from '../components/execution/ExecutionContextViewer'
import { Button } from '../components/ui/Button'
import { ArrowLeft, Loader2 } from 'lucide-react'

export function JourneyInstanceDetailsPage() {
  const { instanceId } = useParams<{ instanceId: string }>()
  const navigate = useNavigate()
  const { data, loading, error, refetch, loadMoreHistory, hasMoreHistory } = useJourneyInstanceDetails(instanceId || '')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => navigate('/journey-instances')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Listagem
        </Button>
      </div>
    )
  }

  if (!data.instance || !data.definition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Instância não encontrada</p>
        <Button onClick={() => navigate('/journey-instances')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Listagem
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/journey-instances')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Detalhes da Instância</h1>
      </div>

      <ExecutionInfoPanel instance={data.instance} definition={data.definition} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ExecutionFlowViewer
            definition={data.definition}
            executionNodeStates={data.executionNodeStates}
          />
          <ExecutionContextViewer context={data.instance.context} />
        </div>
        <ExecutionHistoryTimeline
          history={data.history}
          onLoadMore={loadMoreHistory}
          hasMore={hasMoreHistory}
          isLoading={false}
        />
      </div>
    </div>
  )
}
```

### 3. Add Route

Update `src/App.tsx` to add the new route:

```typescript
import { JourneyInstanceDetailsPage } from './pages/JourneyInstanceDetailsPage'

// In your routes configuration:
<Route path="/journey-instances/:instanceId" element={<JourneyInstanceDetailsPage />} />
```

### 4. Add "View Details" Button

Update `src/components/dashboard/JourneyInstancesTable.tsx` to add the action button:

```typescript
<Button
  variant="outline"
  size="sm"
  onClick={() => navigate(`/journey-instances/${instance.instanceId}`)}
>
  Visualizar Detalhes
</Button>
```

## Testing

### Manual Testing

1. Navigate to Journey Instances list
2. Click "Visualizar Detalhes" on an instance
3. Verify:
   - General info panel displays correctly
   - Flow diagram renders with colored nodes
   - History timeline shows transitions
   - Context viewer displays JSON
   - Empty states show appropriate messages

### Test Data

Create test data using the backend API:

```bash
# Create a journey definition
POST /journeys
{
  "journeyCode": "test-journey",
  "name": "Test Journey",
  "version": 1,
  "status": "ATIVA",
  "states": [...],
  "transitions": [...]
}

# Start an instance
POST /journey-instances
{
  "journeyCode": "test-journey",
  "version": 1,
  "context": {
    "testData": "value"
  }
}
```

## Troubleshooting

### Instance Not Found

- Verify instanceId is correct
- Check backend API is running
- Check instance exists in database

### Definition Not Found

- Verify journeyDefinitionId matches an existing definition
- Check journeyVersion is correct
- Definition may have been deleted

### Flow Diagram Not Rendering

- Check React Flow is properly initialized
- Verify states and transitions data is valid
- Check console for React Flow errors

### History Not Loading

- Verify history API endpoint is working
- Check pagination parameters
- Verify instance has transition history

## Next Steps

After completing the quickstart:

1. Implement remaining components (ExecutionFlowViewer, ExecutionInfoPanel, etc.)
2. Add unit tests for components and hooks
3. Add integration tests for the page
4. Verify performance with large diagrams (50+ states)
5. Verify pagination works for large histories (1000+ transitions)
