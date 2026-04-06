interface EmptyStateProps {
  onCreateJourney: () => void;
  message?: string;
}

export function EmptyState({ onCreateJourney, message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 13H15M9 17H15M12 3L3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H19C19.5304 18 20.0391 17.7893 20.4142 17.4142C20.7893 17.0391 21 16.5304 21 16V8L12 3Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h3 className="empty-state-title">
          {message || 'No journey definitions found'}
        </h3>
        
        <p className="empty-state-description">
          Get started by creating your first journey definition. Journeys help you define and manage business workflows.
        </p>
        
        <button 
          className="create-journey-btn primary"
          onClick={onCreateJourney}
        >
          Create Your First Journey
        </button>
      </div>
    </div>
  );
}
