import React from 'react';
import './LoadingSpinner.css';

interface Props {
  text?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ text = '加载中...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">{text}</div>
    </div>
  );
}; 