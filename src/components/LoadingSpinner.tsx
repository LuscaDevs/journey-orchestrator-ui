interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ message = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" data-size={size}>
      <div className="spinner-container">
        <div className="spinner"></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    </div>
  );
}
