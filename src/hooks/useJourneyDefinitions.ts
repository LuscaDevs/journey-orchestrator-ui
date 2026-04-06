import { useState, useEffect } from 'react';
import { listJourneyDefinitions } from '../services/journeyService';
import type { JourneyDefinitionResponse } from '../api/models';
import type { JourneyDefinitionListItem } from '../types/journey.types';

export function useJourneyDefinitions() {
  const [journeys, setJourneys] = useState<JourneyDefinitionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const loadJourneys = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await listJourneyDefinitions();
      const transformedJourneys = response.map(transformJourneyToListItem);
      setJourneys(transformedJourneys);
    } catch (err) {
      setError('Failed to load journey definitions');
      console.error('Load journeys error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshJourneys = () => {
    loadJourneys();
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  return {
    journeys,
    loading,
    error,
    loadJourneys,
    refreshJourneys,
  };
}

// Helper function to transform API response to list item
function transformJourneyToListItem(journey: JourneyDefinitionResponse): JourneyDefinitionListItem {
  return {
    id: journey.id || '',
    journeyCode: journey.journeyCode || '',
    name: journey.name || '',
    version: journey.version || 1,
    active: journey.active || false,
    createdAt: typeof journey.createdAt === 'string' ? journey.createdAt : new Date().toISOString(),
  };
}
