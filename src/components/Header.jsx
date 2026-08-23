import React from 'react';
import { Sparkles, FileText, Cpu, Github, ExternalLink } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon-box">
            <div className="logo-glow-layer"></div>
            <FileText className="logo-file-icon" size={22} />
            <Sparkles className="logo-sparkle-icon" size={13} />
          </div>
          <div className="logo-text-group">
            <div className="logo-title-row">
              <span className="logo-title">BriefCraft</span>
              <span className="logo-badge">AI 2.0</span>
            </div>
            <p className="logo-tagline">Intelligent Document Synthesis & Executive Intelligence</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-pill status-pill">
            <span className="status-live-dot"></span>
            <Cpu size={13} className="pill-icon" />
            <span>Groq LLaMA 3.3 Active</span>
          </div>

          <a
            href="https://github.com/devendrasai05/document-summarizer"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link-btn"
            title="View source code on GitHub"
          >
            <Github size={15} />
            <span>GitHub</span>
            <ExternalLink size={12} className="link-arrow" />
          </a>
        </div>
      </div>
    </header>
  );
}
