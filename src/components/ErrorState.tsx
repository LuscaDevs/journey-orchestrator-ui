interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryable?: boolean;
}

export function ErrorState({ message, onRetry, retryable = false }: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-state-content">
        <div className="error-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h3 className="error-state-title">Something went wrong</h3>
        
        <p className="error-state-message">
          {message}
        </p>
        
        {retryable && onRetry && (
          <div className="error-state-actions">
            <button 
              className="retry-btn"
              onClick={onRetry}
              aria-label="Retry loading journey definitions"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
