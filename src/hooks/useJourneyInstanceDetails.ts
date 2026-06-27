import { useState, useEffect } from 'react';
import { getJourneyInstance, getJourneyDefinitionsByCode } from '../services/journeyService';
import { JourneyInstanceHistoryApi } from '../api';
import { apiConfig } from '../services/apiConfig';
import type { JourneyInstanceResponse, JourneyDefinitionResponse, TransitionHistoryEventResponse } from '../api/models';
import type { ExecutionNodeState, ExecutionNodeStatus } from '../types/execution.types';

const historyApi = new JourneyInstanceHistoryApi(apiConfig);

export interface UseJourneyInstanceDetailsReturn {
  data: {
    instance: JourneyInstanceResponse | null;
    definition: JourneyDefinitionResponse | null;
    history: TransitionHistoryEventResponse[];
    executionNodeStates: Map<string, ExecutionNodeState>;
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMoreHistory: () => void;
  hasMoreHistory: boolean;
  isLoadingMoreHistory: boolean;
}

export function useJourneyInstanceDetails(instanceId: string): UseJourneyInstanceDetailsReturn {
  const [data, setData] = useState({
    instance: null as JourneyInstanceResponse | null,
    definition: null as JourneyDefinitionResponse | null,
    history: [] as TransitionHistoryEventResponse[],
    executionNodeStates: new Map<string, ExecutionNodeState>()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLoadingMoreHistory, setIsLoadingMoreHistory] = useState(false);

  const fetchData = async () => {
    if (!instanceId) {
      setError('Instance ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch instance
      const instance = await getJourneyInstance(instanceId);

      // Fetch definition using journeyCode and version
      // Note: We need to find the definition by code and version
      const definitions = await getJourneyDefinitionsByCode(instance.journeyCode || '');
      const definition = definitions.find((def: JourneyDefinitionResponse) => def.version === instance.version) || null;

      // Fetch history (first page)
      const historyResponse = await historyApi.getJourneyInstanceHistory(instanceId, undefined, undefined, undefined, 50, 0);
      const history = historyResponse.data.events || [];

      // Derive execution node states
      const executionNodeStates = deriveExecutionNodeStates(instance, history, definition);

      setData({
        instance,
        definition,
        history,
        executionNodeStates
      });
      setHistoryOffset(history.length);
      setHasMoreHistory((historyResponse.data.pagination?.hasNext || false) && history.length >= 50);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch instance details';
      setError(errorMessage);
      console.error('Fetch instance details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreHistory = async () => {
    if (!data.instance || isLoadingMoreHistory || !hasMoreHistory || !data.instance.instanceId) {
      return;
    }

    try {
      setIsLoadingMoreHistory(true);
      const historyResponse = await historyApi.getJourneyInstanceHistory(
        data.instance.instanceId,
        undefined,
        undefined,
        undefined,
        50,
        historyOffset
      );
      const newHistory = historyResponse.data.events || [];

      setData(prev => ({
        ...prev,
        history: [...prev.history, ...newHistory]
      }));
      setHistoryOffset(prev => prev + newHistory.length);
      setHasMoreHistory((historyResponse.data.pagination?.hasNext || false) && newHistory.length >= 50);
    } catch (err: any) {
      console.error('Load more history error:', err);
    } finally {
      setIsLoadingMoreHistory(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [instanceId]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    loadMoreHistory,
    hasMoreHistory,
    isLoadingMoreHistory
  };
}

/**
 * Derive execution node states from instance history and current state
 */
function deriveExecutionNodeStates(
  instance: JourneyInstanceResponse,
  history: TransitionHistoryEventResponse[],
  definition: JourneyDefinitionResponse | null
): Map<string, ExecutionNodeState> {
  const states = new Map<string, ExecutionNodeState>();
  const visitedStates = new Set<string>();

  // Mark visited states from history
  history.forEach(entry => {
    visitedStates.add(entry.toState);
  });

  // If we have the definition, iterate through all states
  if (definition && definition.states) {
    definition.states.forEach(state => {
      const stateName = state.name;
      let status: ExecutionNodeStatus = 'PENDING';

      if (stateName === instance.currentState) {
        // Current state
        status = instance.status === 'FAILED' ? 'FAILED' : 'RUNNING';
      } else if (visitedStates.has(stateName)) {
        // Visited state
        status = 'COMPLETED';
      }

      states.set(stateName, {
        stateName,
        executionStatus: status
      });
    });
  } else {
    // Fallback: derive from history and current state only
    if (instance.currentState) {
      const status: ExecutionNodeStatus = instance.status === 'FAILED' ? 'FAILED' : 'RUNNING';
      states.set(instance.currentState, {
        stateName: instance.currentState,
        executionStatus: status
      });
    }

    visitedStates.forEach(stateName => {
      if (stateName !== instance.currentState) {
        states.set(stateName, {
          stateName,
          executionStatus: 'COMPLETED'
        });
      }
    });
  }

  return states;
}
