import { useState, useEffect } from 'react';
import { listJourneyInstances } from '../services/journeyService';
import type { JourneyInstanceResponse } from '../api/models';

export interface JourneyInstanceListItem {
  instanceId: string;
  journeyCode: string;
  version: number;
  currentState: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

export function useJourneyInstances() {
  const [instances, setInstances] = useState<JourneyInstanceListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const loadInstances = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await listJourneyInstances();
      const transformedInstances = response.map(transformInstanceToListItem);
      setInstances(transformedInstances);
    } catch (err) {
      setError('Failed to load journey instances');
      console.error('Load instances error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshInstances = () => {
    loadInstances();
  };

  useEffect(() => {
    loadInstances();
  }, []);

  return {
    instances,
    loading,
    error,
    loadInstances,
    refreshInstances,
  };
}

// Helper function to transform API response to list item
function transformInstanceToListItem(instance: JourneyInstanceResponse): JourneyInstanceListItem {
  return {
    instanceId: instance.instanceId || '',
    journeyCode: instance.journeyCode || '',
    version: instance.version || 1,
    currentState: instance.currentState || '',
    status: instance.status || 'RUNNING',
    createdAt: typeof instance.createdAt === 'string' ? instance.createdAt : new Date().toISOString(),
  };
}
