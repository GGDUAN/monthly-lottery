import React from 'react';
import './ErrorMessage.css';

interface Props {
  error: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<Props> = ({ error, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-text">{error}</div>
      {onRetry && (
        <button 
          className="retry-button"
          onClick={onRetry}
        >
          重试
        </button>
      )}
    </div>
  );
}; 