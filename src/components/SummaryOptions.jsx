import React from 'react';
import { Zap, FileText, BookOpen, Check } from 'lucide-react';

const OPTIONS = [
  {
    id: 'short',
    title: 'Short',
    subtitle: 'Quick overview',
    description: 'Concise summary with 3 essential takeaways for rapid scanning.',
    icon: Zap,
    badge: 'Fast Read'
  },
  {
    id: 'medium',
    title: 'Medium',
    subtitle: 'Balanced detail',
    description: 'Well-rounded summary covering key points and actionable recommendations.',
    icon: FileText,
    badge: 'Recommended',
    isDefault: true
  },
  {
    id: 'detailed',
    title: 'Detailed',
    subtitle: 'In-depth analysis',
    description: 'Comprehensive breakdown covering deep-dive concepts, findings, and suggestions.',
    icon: BookOpen,
    badge: 'Deep Dive'
  }
];

export default function SummaryOptions({ selectedLength, onChange, disabled }) {
  return (
    <div className="summary-options-container">
      <div className="options-header">
        <label className="section-label">Summary Depth</label>
        <span className="options-subtext">Choose the level of detail for the AI analysis</span>
      </div>

      <div className="options-grid" role="radiogroup" aria-label="Summary Length Options">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLength === option.id;

          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              className={`option-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
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
              <div className="option-card-header">
                <div className="option-icon-box">
                  <Icon size={20} className="option-icon" />
                </div>
                {option.badge && (
                  <span className={`option-badge ${option.isDefault ? 'badge-primary' : 'badge-neutral'}`}>
                    {option.badge}
                  </span>
                )}
              </div>

              <div className="option-content">
                <h4 className="option-title">{option.title}</h4>
                <p className="option-subtitle">{option.subtitle}</p>
                <p className="option-description">{option.description}</p>
              </div>

              <div className="option-selection-indicator">
                <div className={`radio-circle ${isSelected ? 'active' : ''}`}>
                  {isSelected && <Check size={12} className="check-icon" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
