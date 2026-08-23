import React from 'react';
import { Sparkles, FileSearch, Cpu, ShieldCheck, Github, ExternalLink, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo & Brand */}
        <div className="logo-section">
          <div className="logo-icon-box">
            <div className="logo-glow-layer"></div>
            <FileSearch className="logo-main-icon" size={22} />
            <Sparkles className="logo-sparkle-icon" size={12} />
          </div>
          <div className="logo-text-group">
            <div className="logo-title-row">
              <span className="logo-title">DocuLens</span>
              <span className="logo-badge">PRO</span>
            </div>
            <p className="logo-tagline">Executive Document Intelligence & Synthesis Suite</p>
          </div>
        </div>

        {/* System Capability Pills */}
        <div className="header-capabilities">
          <div className="cap-item">
            <Zap size={13} className="cap-icon text-amber" />
            <span>&lt;800ms Inference</span>
          </div>
          <div className="cap-item">
            <ShieldCheck size={13} className="cap-icon text-emerald" />
            <span>Private OCR</span>
          </div>
          <div className="cap-item cap-pill-status">
            <span className="status-live-dot"></span>
            <span>Groq LLaMA 3.3 Active</span>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="header-actions">
          <a
            href="https://github.com/devendrasai05/document-summarizer"
            target="_blank"
            rel="noopener noreferrer"
            className="header-link-btn"
            title="View Source on GitHub"
          >
            <Github size={15} />
            <span>Repository</span>
            <ExternalLink size={12} className="link-arrow" />
          </a>
        </div>
      </div>
    </header>
  );
}
