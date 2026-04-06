import { JourneyDefinitionCard } from '../components/JourneyDefinitionCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import type { JourneyDefinitionListItem } from '../types/journey.types';
import '../components/JourneyDefinitionList.css';

interface JourneyDefinitionListProps {
  journeys: JourneyDefinitionListItem[];
  loading: boolean;
  error?: string;
  onJourneyClick: (journeyId: string) => void;
  onCreateJourney: () => void;
  onRetry?: () => void;
}

export function JourneyDefinitionList({
  journeys,
  loading,
  error,
  onJourneyClick,
  onCreateJourney,
  onRetry,
}: JourneyDefinitionListProps) {
  if (loading) {
    return <LoadingSpinner message="Loading journey definitions..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={onRetry}
        retryable={!!onRetry}
      />
    );
  }

  if (journeys.length === 0) {
    return <EmptyState onCreateJourney={onCreateJourney} />;
  }

  return (
    <div className="journey-list">
      <div className="journey-list-header">
        <h2>Journey Definitions ({journeys.length})</h2>
      </div>
      <div className="journey-list-grid">
        {journeys.map((journey) => (
          <JourneyDefinitionCard
            key={journey.id}
            journey={journey}
            onClick={() => onJourneyClick(journey.id)}
          />
        ))}
      </div>
    </div>
  );
}
