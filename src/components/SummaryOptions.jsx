import React from 'react';
import { Zap, FileText, BookOpen, Check } from 'lucide-react';

const OPTIONS = [
  {
    id: 'short',
    title: 'Short',
    subtitle: 'Quick Overview',
    detail: '2-3 key sentences & 3 high-impact takeaways',
    time: '~1 min read',
    icon: Zap,
    badge: 'Fast Read'
  },
  {
    id: 'medium',
    title: 'Medium',
    subtitle: 'Balanced Brief',
    detail: '1-2 detailed paragraphs & 5 core insights',
    time: '~3 min read',
    icon: FileText,
    badge: 'Recommended',
    isDefault: true
  },
  {
    id: 'detailed',
    title: 'Detailed',
    subtitle: 'Executive Deep-Dive',
    detail: 'Comprehensive multi-paragraph analysis & strategic pillars',
    time: '~6 min read',
    icon: BookOpen,
    badge: 'In-Depth'
  }
];

export default function SummaryOptions({ selectedLength, onChange, disabled }) {
  return (
    <div className="options-control-block">
      <div className="options-title-row">
        <label className="options-main-label">Analysis Depth</label>
        <span className="options-counter-badge">3 Modes</span>
      </div>

      <div className="depth-cards-stack" role="radiogroup" aria-label="Synthesis Depth">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLength === option.id;

          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              className={`depth-choice-card ${isSelected ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
              onClick={() => {
                if (!disabled) onChange(option.id);
              }}
              onKeyDown={(e) => {
                if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
                  e.preventDefault();
                  onChange(option.id);
                }
              }}
            >
              <div className="choice-left-group">
                <div className="choice-icon-frame">
                  <Icon size={17} className="choice-icon" />
                </div>
                <div className="choice-text-group">
                  <div className="choice-headline-row">
                    <span className="choice-title">{option.title}</span>
                    <span className="choice-sub-text">• {option.subtitle}</span>
                  </div>
                  <p className="choice-detail">{option.detail}</p>
                </div>
              </div>

              <div className="choice-right-group">
                {option.badge && (
                  <span className={`choice-badge ${option.isDefault ? 'badge-primary' : 'badge-subtle'}`}>
                    {option.badge}
                  </span>
                )}
                <div className={`choice-radio-indicator ${isSelected ? 'active' : ''}`}>
                  {isSelected && <Check size={11} className="radio-check" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
