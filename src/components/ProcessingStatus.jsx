import React from 'react';
import { Loader2, CheckCircle2, Circle, Sparkles, Cpu, FileText, FileSearch, Check } from 'lucide-react';

const STAGES = [
  { id: 'prep', label: 'Preparing document payload & security sandbox', icon: FileText },
  { id: 'extract', label: 'Parsing document streams & running optical recognition', icon: FileSearch },
  { id: 'analyze', label: 'Mapping lexical hierarchy & key semantic vectors', icon: Cpu },
  { id: 'ai', label: 'Synthesizing executive summary via Groq LLaMA 3.3', icon: Sparkles },
  { id: 'finalize', label: 'Validating structured schema & formatting output', icon: Check }
];

export default function ProcessingStatus({ currentStageIndex = 0, statusMessage, percentage = 0 }) {
  return (
    <div className="processing-telemetry-card" aria-live="polite">
      {/* Top Processing Header */}
      <div className="telemetry-top-header">
        <div className="telemetry-spin-box">
          <Loader2 className="telemetry-spinner" size={26} />
        </div>
        <div className="telemetry-title-group">
          <div className="telemetry-tag-row">
            <span className="telemetry-live-chip">Processing</span>
            <span className="telemetry-model-chip">Groq LLaMA 3.3 Engine</span>
          </div>
          <h3 className="telemetry-heading">Autonomous Document Synthesis</h3>
          <p className="telemetry-status-text">{statusMessage || 'Extracting typography and generating structured intelligence...'}</p>
        </div>
      </div>

      {/* Progress Bar & Telemetry Metrics */}
      <div className="telemetry-progress-wrapper">
        <div className="telemetry-track">
          <div
            className="telemetry-fill"
            style={{ width: `${Math.min(100, Math.max(8, percentage))}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <div className="telemetry-metrics-row">
          <span className="telemetry-status-phase">Stage {Math.min(5, currentStageIndex + 1)} of 5</span>
          <span className="telemetry-pct-counter">{Math.round(percentage)}%</span>
        </div>
      </div>

      {/* Structured Pipeline Timeline */}
      <div className="telemetry-stages-list">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`telemetry-stage-row ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''} ${isPending ? 'is-pending' : ''}`}
            >
              <div className="stage-indicator-frame">
                {isCompleted ? (
                  <CheckCircle2 size={16} className="stage-check-icon text-emerald" />
                ) : isCurrent ? (
                  <div className="stage-radar-dot">
                    <span className="radar-ping" />
                    <Icon size={12} className="radar-icon text-primary" />
                  </div>
                ) : (
                  <Circle size={12} className="stage-hollow-icon" />
                )}
              </div>
              <span className="stage-text-label">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
