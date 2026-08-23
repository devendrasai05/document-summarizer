import React from 'react';
import { AlertTriangle, X, RotateCcw } from 'lucide-react';

export default function ErrorAlert({ message, onDismiss, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-alert-banner" role="alert">
      <div className="error-alert-content">
        <div className="error-icon-box">
          <AlertTriangle size={20} className="error-svg-icon" />
        </div>
        <div className="error-text-container">
          <h4 className="error-heading">Analysis Error</h4>
          <p className="error-desc">{message}</p>
        </div>
      </div>

      <div className="error-alert-actions">
        {onRetry && (
          <button
            type="button"
            className="error-retry-btn"
            onClick={onRetry}
            title="Retry analysis"
          >
            <RotateCcw size={14} />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="error-dismiss-btn"
            onClick={onDismiss}
            title="Dismiss error"
            aria-label="Dismiss error notification"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
