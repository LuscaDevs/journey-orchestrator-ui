import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useJourneyDefinitions } from '../hooks/useJourneyDefinitions';
import { JourneyDefinitionList } from '../components/JourneyDefinitionList';
import { CreateJourneyModal } from '../components/CreateJourneyModal';
import type { CreateJourneyFormData } from '../types/journey.types';

export function JourneyDefinitionsPage() {
  const { journeys, loading, error, refreshJourneys } = useJourneyDefinitions();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateJourney = async (_data: CreateJourneyFormData) => {
    try {
      // This will be implemented when we add the createJourney hook
      toast.success('Journey creation functionality coming soon!');
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error('Failed to create journey');
      console.error('Create journey error:', error);
    }
  };

  const handleJourneyClick = (journeyId: string) => {
    navigate(`/journeys/${journeyId}`);
  };

  const handleCreateJourneyClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="journey-definitions-page">
      <div className="page-header">
        <h1>Journey Definitions</h1>
        <button
          className="create-journey-btn"
          onClick={handleCreateJourneyClick}
        >
          Create Journey
        </button>
      </div>

      <JourneyDefinitionList
        journeys={journeys}
        loading={loading}
        error={error}
        onJourneyClick={handleJourneyClick}
        onCreateJourney={handleCreateJourneyClick}
        onRetry={refreshJourneys}
      />

      <CreateJourneyModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateJourney}
      />
    </div>
  );
}
