import React from 'react';
import { Sparkles, FileText, Cpu } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon-box">
            <FileText className="logo-file-icon" size={24} />
            <Sparkles className="logo-sparkle-icon" size={14} />
          </div>
          <div className="logo-text-group">
            <div className="logo-title-row">
              <span className="logo-title">DocuMind</span>
              <span className="logo-badge">AI Assistant</span>
            </div>
            <p className="logo-tagline">Intelligent Document Extraction & Structured Summarization</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-pill">
            <Cpu size={14} className="pill-icon" />
            <span>High-Speed AI Inference</span>
          </div>
        </div>
      </div>
    </header>
  );
}
