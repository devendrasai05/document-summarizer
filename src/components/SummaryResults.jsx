import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  ListChecks,
  Lightbulb,
  Compass,
  Copy,
  Check,
  Download,
  RotateCcw,
  BookOpen,
  Layers,
  Clock,
  HardDrive,
  Volume2,
  VolumeX,
  Printer,
  FileCode,
  CheckSquare,
  Square,
  Eye,
  Zap,
  Share2
} from 'lucide-react';
import { formatBytes, countWords, estimateReadingTime } from '../utils/fileUtils';

export default function SummaryResults({
  result,
  fileMeta,
  selectedLength,
  extractedText = '',
  onLengthChange,
  onReset,
  isReanalyzing = false
}) {
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [checkedSuggestions, setCheckedSuggestions] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'summary', 'points', 'suggestions'

  const { summary, keyPoints = [], mainIdeas = [], suggestions = [] } = result || {};
  const wordCount = countWords(summary);
  const readTime = estimateReadingTime(summary);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyFull = async () => {
    const fullText = `=== BRIEFCRAFT AI DOCUMENT ANALYSIS ===
Document: ${fileMeta?.name || 'Uploaded Document'}
Analysis Depth: ${selectedLength.toUpperCase()}
Generated: ${new Date().toLocaleString()}

========================================
DOCUMENT SUMMARY
========================================
${summary}

========================================
KEY POINTS
========================================
${keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

========================================
MAIN IDEAS & STRATEGIC THEMES
========================================
${mainIdeas.map((m, i) => `${i + 1}. ${m}`).join('\n')}

========================================
IMPROVEMENT SUGGESTIONS & NEXT STEPS
========================================
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleCopySnippet = async (text, indexKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(indexKey);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# BriefCraft AI – Document Analysis Report

**File Name:** \`${fileMeta?.name || 'Document'}\`  
**Document Type:** ${fileMeta?.isPdf ? 'PDF Document' : 'Image OCR Scan'}  
**File Size:** ${formatBytes(fileMeta?.size)}  
${fileMeta?.pageCount ? `**Pages Analyzed:** ${fileMeta.pageCount}  \n` : ''}**Analysis Depth:** ${selectedLength.toUpperCase()}  
**Generated On:** ${new Date().toLocaleString()}  

---

## 📄 Executive Summary
${summary}

---

## 🎯 Key Points & Critical Findings
${keyPoints.map((pt) => `- ${pt}`).join('\n')}

---

## 💡 Main Ideas & Strategic Themes
${mainIdeas.map((idea) => `- ${idea}`).join('\n')}

---

## 🚀 Improvement Suggestions & Action Items
${suggestions.map((sug, i) => `- [ ] **Action ${i + 1}:** ${sug}`).join('\n')}

---
*Synthesized autonomously by BriefCraft AI – Production Document Intelligence*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(fileMeta?.name || 'BriefCraft_Report').replace(/\.[^/.]+$/, '')}_analysis.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSuggestionCheck = (index) => {
    setCheckedSuggestions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="results-container printable-report">
      {/* Top Banner with Quick Actions & Depth Switcher */}
      <div className="results-hero-card">
        <div className="hero-top-row">
          <div className="hero-badge-group">
            <span className="success-badge">
              <CheckCircle2 size={15} /> AI SYNTHESIS COMPLETE
            </span>
            <span className="length-badge">
              <Sparkles size={13} /> {selectedLength.toUpperCase()} DEPTH
            </span>
          </div>

          {/* Quick Depth Regenerator Toolbar */}
          {onLengthChange && (
            <div className="depth-toggle-group" role="group" aria-label="Change summary depth">
              <span className="depth-toggle-label">Depth:</span>
              {['short', 'medium', 'detailed'].map((len) => (
                <button
                  key={len}
                  type="button"
                  className={`depth-toggle-btn ${selectedLength === len ? 'active' : ''}`}
                  onClick={() => onLengthChange(len)}
                  disabled={isReanalyzing}
                  title={`Switch to ${len} depth analysis`}
                >
                  {len.charAt(0).toUpperCase() + len.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="hero-action-buttons no-print">
            <button
              type="button"
              className={`action-btn audio-btn ${isPlayingAudio ? 'playing' : ''}`}
              onClick={toggleSpeech}
              title={isPlayingAudio ? 'Stop audio read aloud' : 'Listen to executive summary'}
            >
              {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isPlayingAudio ? 'Stop Voice' : 'Listen'}</span>
            </button>

            <button
              type="button"
              className="action-btn copy-btn"
              onClick={handleCopyFull}
              title="Copy complete analysis markdown to clipboard"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-success" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="action-btn download-btn"
              onClick={handleDownloadMarkdown}
              title="Export analysis report as Markdown"
            >
              <Download size={15} />
              <span>Export MD</span>
            </button>

            <button
              type="button"
              className="action-btn print-btn"
              onClick={handlePrint}
              title="Print report or save as PDF"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              className="action-btn reset-btn"
              onClick={onReset}
              title="Analyze another document"
            >
              <RotateCcw size={15} />
              <span>New Document</span>
            </button>
          </div>
        </div>

        {/* Document Info Strip */}
        <div className="doc-meta-strip">
          <div className="meta-item">
            <FileText size={16} className="meta-icon" />
            <div className="meta-text">
              <span className="meta-label">Document Name</span>
              <span className="meta-value" title={fileMeta?.name}>
                {fileMeta?.name || 'Document'}
              </span>
            </div>
          </div>

          <div className="meta-item">
            <HardDrive size={16} className="meta-icon" />
            <div className="meta-text">
              <span className="meta-label">Format & Size</span>
              <span className="meta-value">
                {fileMeta?.isPdf ? 'PDF Document' : 'Image Scan'} • {formatBytes(fileMeta?.size)}
              </span>
            </div>
          </div>

          {fileMeta?.pageCount && (
            <div className="meta-item">
              <Layers size={16} className="meta-icon" />
              <div className="meta-text">
                <span className="meta-label">Page Count</span>
                <span className="meta-value">{fileMeta.pageCount} page{fileMeta.pageCount > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}

          <div className="meta-item">
            <Clock size={16} className="meta-icon" />
            <div className="meta-text">
              <span className="meta-label">Est. Reading Time</span>
              <span className="meta-value">{readTime} min read ({wordCount} words)</span>
            </div>
          </div>

          {extractedText && (
            <div className="meta-item raw-text-trigger no-print">
              <button
                type="button"
                className="raw-text-btn"
                onClick={() => setShowRawText(!showRawText)}
                title="View original extracted text"
              >
                <Eye size={14} />
                <span>{showRawText ? 'Hide Raw Text' : 'View Raw Text'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Collapsible Raw Extracted Text Drawer */}
        {showRawText && extractedText && (
          <div className="raw-text-drawer">
            <div className="raw-text-drawer-header">
              <div className="raw-text-header-left">
                <FileCode size={16} />
                <span className="raw-text-title">Extracted Document Text ({formatBytes(extractedText.length)})</span>
              </div>
              <button
                type="button"
                className="raw-text-copy-btn"
                onClick={() => handleCopySnippet(extractedText, 'raw-text')}
              >
                {copiedIndex === 'raw-text' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedIndex === 'raw-text' ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="raw-text-content">{extractedText}</pre>
          </div>
        )}
      </div>

      {/* Navigation Filter Tabs */}
      <div className="results-tabs-bar no-print">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>All Sections</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <BookOpen size={14} />
          <span>Executive Summary</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          <ListChecks size={14} />
          <span>Key Points & Ideas ({keyPoints.length + mainIdeas.length})</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          <Lightbulb size={14} />
          <span>Action Items ({suggestions.length})</span>
        </button>
      </div>

      {/* Main Results Grid */}
      <div className="results-grid">
        {/* 1. DOCUMENT SUMMARY */}
        {(activeTab === 'all' || activeTab === 'summary') && (
          <section className="result-card summary-card" aria-labelledby="summary-title">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-pill icon-blue">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 id="summary-title" className="card-title">EXECUTIVE DOCUMENT SUMMARY</h3>
                  <p className="card-subtitle">Synthesized overview generated from extracted document structure</p>
                </div>
              </div>

              <div className="card-header-actions no-print">
                <button
                  type="button"
                  className="card-mini-copy-btn"
                  onClick={() => handleCopySnippet(summary, 'summary')}
                  title="Copy summary"
                >
                  {copiedIndex === 'summary' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedIndex === 'summary' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="summary-paragraph">{summary}</p>
            </div>
          </section>
        )}

        {/* 2. KEY POINTS */}
        {(activeTab === 'all' || activeTab === 'points') && (
          <section className="result-card keypoints-card" aria-labelledby="keypoints-title">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-pill icon-indigo">
                  <ListChecks size={18} />
                </div>
                <div>
                  <h3 id="keypoints-title" className="card-title">KEY POINTS & CRITICAL FINDINGS</h3>
                  <p className="card-subtitle">Essential facts, statistics, and qualitative takeaways</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <ul className="points-list">
                {keyPoints.map((point, index) => (
                  <li key={index} className="point-item">
                    <div className="point-bullet-box">
                      <span className="point-number">{index + 1}</span>
                    </div>
                    <span className="point-text">{point}</span>
                    <button
                      type="button"
                      className="point-copy-icon-btn no-print"
                      onClick={() => handleCopySnippet(point, `kp-${index}`)}
                      title="Copy this key point"
                    >
                      {copiedIndex === `kp-${index}` ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 3. MAIN IDEAS */}
        {(activeTab === 'all' || activeTab === 'points') && (
          <section className="result-card mainideas-card" aria-labelledby="mainideas-title">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-pill icon-violet">
                  <Compass size={18} />
                </div>
                <div>
                  <h3 id="mainideas-title" className="card-title">MAIN IDEAS & STRATEGIC THEMES</h3>
                  <p className="card-subtitle">Overarching concepts, underlying principles, and strategic focus areas</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <ul className="points-list">
                {mainIdeas.map((idea, index) => (
                  <li key={index} className="point-item">
                    <div className="point-bullet-box idea-box">
                      <span className="point-number">{index + 1}</span>
                    </div>
                    <span className="point-text">{idea}</span>
                    <button
                      type="button"
                      className="point-copy-icon-btn no-print"
                      onClick={() => handleCopySnippet(idea, `mi-${index}`)}
                      title="Copy this idea"
                    >
                      {copiedIndex === `mi-${index}` ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 4. IMPROVEMENT SUGGESTIONS */}
        {(activeTab === 'all' || activeTab === 'suggestions') && (
          <section className="result-card suggestions-card" aria-labelledby="suggestions-title">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-pill icon-amber">
                  <Lightbulb size={18} />
                </div>
                <div>
                  <h3 id="suggestions-title" className="card-title">IMPROVEMENT SUGGESTIONS & ACTION ITEMS</h3>
                  <p className="card-subtitle">Practical next steps and recommendations (interactive checklist)</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => {
                  const isChecked = !!checkedSuggestions[index];

                  return (
                    <div
                      key={index}
                      className={`suggestion-item ${isChecked ? 'suggestion-checked' : ''}`}
                      onClick={() => toggleSuggestionCheck(index)}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleSuggestionCheck(index);
                        }
                      }}
                    >
                      <div className="suggestion-check-indicator">
                        {isChecked ? (
                          <CheckSquare size={18} className="check-box-icon checked" />
                        ) : (
                          <Square size={18} className="check-box-icon" />
                        )}
                      </div>

                      <div className="suggestion-content">
                        <div className="suggestion-title-row">
                          <span className="suggestion-title">Actionable Item #{index + 1}</span>
                          {isChecked && <span className="completed-badge">Completed</span>}
                        </div>
                        <p className={`suggestion-text ${isChecked ? 'text-strikethrough' : ''}`}>
                          {suggestion}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Bottom Floating Reset Action */}
      <div className="bottom-reset-bar no-print">
        <button
          type="button"
          className="btn-primary-reset"
          onClick={onReset}
        >
          <RotateCcw size={18} />
          <span>Analyze Another Document</span>
        </button>
      </div>
    </div>
  );
}
