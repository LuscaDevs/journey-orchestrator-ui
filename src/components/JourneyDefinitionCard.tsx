import type { JourneyDefinitionListItem } from '../types/journey.types';
import './JourneyDefinitionCard.css';

interface JourneyDefinitionCardProps {
  journey: JourneyDefinitionListItem;
  onClick: (journeyId: string) => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
  selected?: boolean;
}

export function JourneyDefinitionCard({
  journey,
  onClick,
  variant = 'default',
  disabled = false,
  selected = false,
}: JourneyDefinitionCardProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick(journey.id);
    }
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
        <span className={`journey-card-status ${journey.active ? 'active' : 'inactive'}`}>
          {journey.active ? 'Active' : 'Inactive'}
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
        <span className="journey-card-action">View Details →</span>
      </div>
    </div>
  );
}
