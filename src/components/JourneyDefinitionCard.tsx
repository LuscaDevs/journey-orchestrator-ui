import type { JourneyDefinitionListItem } from '../types/journey.types';
import './JourneyDefinitionCard.css';

interface JourneyDefinitionCardProps {
  journey: JourneyDefinitionListItem;
  onClick: (journeyId: string) => void;
  onActivateDeactivate?: (journeyId: string, currentStatus: 'ATIVA' | 'INATIVA' | 'RASCUNHO') => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
  selected?: boolean;
}

export function JourneyDefinitionCard({
  journey,
  onClick,
  onActivateDeactivate,
  variant = 'default',
  disabled = false,
  selected = false,
}: JourneyDefinitionCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick(journey.id);
    }
  };

  const handleActivateDeactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActivateDeactivate) {
      onActivateDeactivate(journey.id, journey.status);
    }
  };

  const getButtonText = () => {
    if (journey.status === 'RASCUNHO') return 'Ativar';
    if (journey.status === 'ATIVA') return 'Desativar';
    return 'Ativar';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={`journey-card ${variant} ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Journey ${journey.name}, version ${journey.version}`}
    >
      <div className="journey-card-header">
        <h3 className="journey-card-title">{journey.name}</h3>
        <span className={`journey-card-status ${journey.status === 'ATIVA' ? 'active' : journey.status === 'INATIVA' ? 'inactive-red' : 'draft'}`}>
          {journey.status === 'ATIVA' ? 'Ativa' : journey.status === 'INATIVA' ? 'Inativa' : 'Rascunho'}
        </span>
      </div>

      <div className="journey-card-content">
        <div className="journey-card-info">
          <div className="journey-card-code">
            <span className="label">Code:</span>
            <span className="value">{journey.journeyCode}</span>
          </div>
          <div className="journey-card-version">
            <span className="label">Version:</span>
            <span className="value">v{journey.version}</span>
          </div>
        </div>

        {variant === 'default' && (
          <div className="journey-card-meta">
            <div className="journey-card-created">
              <span className="label">Created:</span>
              <span className="value">{formatDate(journey.createdAt)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="journey-card-footer">
        {onActivateDeactivate && (
          <button
            className="journey-card-activate-btn"
            onClick={handleActivateDeactivate}
            disabled={disabled}
          >
            {getButtonText()}
          </button>
        )}
        <span className="journey-card-action">View Details →</span>
      </div>
    </div>
  );
}
