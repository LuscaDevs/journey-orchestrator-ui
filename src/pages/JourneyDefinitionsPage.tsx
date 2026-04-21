import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useJourneyDefinitions } from '../hooks/useJourneyDefinitions';
import { JourneyDefinitionList } from '../components/JourneyDefinitionList';
import { CreateJourneyModal } from '../components/CreateJourneyModal';
import { updateJourneyDefinitionStatus } from '../services/journeyService';
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

  const handleActivateDeactivate = async (journeyId: string, currentStatus: 'ATIVA' | 'INATIVA' | 'RASCUNHO') => {
    try {
      // Determine new status based on current status
      const newStatus: 'ATIVA' | 'INATIVA' | 'RASCUNHO' = 
        currentStatus === 'RASCUNHO' ? 'ATIVA' :
        currentStatus === 'ATIVA' ? 'INATIVA' : 'ATIVA';

      await updateJourneyDefinitionStatus(journeyId, newStatus);
      toast.success(`Jornada ${newStatus === 'ATIVA' ? 'ativada' : newStatus === 'INATIVA' ? 'desativada' : 'definida como rascunho'} com sucesso!`);
      refreshJourneys();
    } catch (error) {
      toast.error('Falha ao atualizar status da jornada');
      console.error('Status update error:', error);
    }
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
        onActivateDeactivate={handleActivateDeactivate}
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
