import React from 'react';
import { Loader2, CheckCircle2, Circle, Sparkles, Cpu, FileText, FileSearch, Check } from 'lucide-react';

const STAGES = [
  { id: 'prep', label: 'Preparing document', icon: FileText },
  { id: 'extract', label: 'Reading file & extracting text', icon: FileSearch },
  { id: 'analyze', label: 'Analyzing content structure', icon: Cpu },
  { id: 'ai', label: 'Generating AI summary & insights', icon: Sparkles },
  { id: 'finalize', label: 'Finalizing structured results', icon: Check }
];

export default function ProcessingStatus({ currentStageIndex = 0, statusMessage, percentage = 0 }) {
  return (
    <div className="processing-container" aria-live="polite">
      <div className="processing-card">
        {/* Animated Icon & Title */}
        <div className="processing-header">
          <div className="processing-spinner-box">
            <Loader2 className="processing-spinner" size={28} />
          </div>
          <div className="processing-text-group">
            <h3 className="processing-title">Analyzing Document with DocuMind AI</h3>
            <p className="processing-status-msg">{statusMessage || 'Extracting text and generating insights...'}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="progress-label-row">
            <span className="progress-status-chip">Processing</span>
            <span className="progress-percentage-text">{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* Stage Timeline */}
        <div className="stages-timeline">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isPending = idx > currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`stage-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
              >
                <div className="stage-icon-indicator">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="stage-check-icon" />
                  ) : isCurrent ? (
                    <div className="stage-current-dot">
                      <span className="pulsing-ping" />
                      <Icon size={14} className="current-icon" />
                    </div>
                  ) : (
                    <Circle size={14} className="stage-pending-icon" />
                  )}
                </div>
                <span className="stage-label">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
