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
  TrendingDown,
  Activity,
  Bookmark
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'points', 'themes', 'actions', 'raw'

  const { summary, keyPoints = [], mainIdeas = [], suggestions = [] } = result || {};
  const summaryWordCount = countWords(summary);
  const rawWordCount = countWords(extractedText) || summaryWordCount * 4;
  const readTime = estimateReadingTime(summary);
  const rawReadTime = estimateReadingTime(extractedText) || Math.max(3, readTime * 4);
  const compressionRatio = rawWordCount > 0 ? Math.max(10, Math.round((1 - summaryWordCount / rawWordCount) * 100)) : 75;

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
    const fullText = `=== DOCULENS AI EXECUTIVE REPORT ===
Document: ${fileMeta?.name || 'Document'}
Analysis Depth: ${selectedLength.toUpperCase()}
Timestamp: ${new Date().toLocaleString()}

========================================
EXECUTIVE SUMMARY
========================================
${summary}

========================================
KEY FINDINGS & CRITICAL METRICS
========================================
${keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

========================================
STRATEGIC THEMES & PILLARS
========================================
${mainIdeas.map((m, i) => `${i + 1}. ${m}`).join('\n')}

========================================
ACTION ROADMAP & RECOMMENDATIONS
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
    const markdownContent = `# DocuLens AI – Executive Document Synthesis

**Document Title:** \`${fileMeta?.name || 'Document'}\`  
**Ingestion Engine:** ${fileMeta?.isPdf ? 'PDF Stream Parser' : 'Tesseract OCR Vision'}  
**File Size:** ${formatBytes(fileMeta?.size)}  
${fileMeta?.pageCount ? `**Pages Processed:** ${fileMeta.pageCount}  \n` : ''}**Depth Profile:** ${selectedLength.toUpperCase()}  
**Synthesis Date:** ${new Date().toLocaleString()}  

---

## 📄 Executive Summary
${summary}

---

## 🎯 Key Findings & Data Points
${keyPoints.map((pt) => `- ${pt}`).join('\n')}

---

## 💡 Strategic Themes & Core Pillars
${mainIdeas.map((idea) => `- ${idea}`).join('\n')}

---

## 🚀 Action Roadmap & Recommendations
${suggestions.map((sug, i) => `- [ ] **Action ${i + 1}:** ${sug}`).join('\n')}

---
*Synthesized autonomously by DocuLens AI – Enterprise Document Intelligence*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(fileMeta?.name || 'DocuLens_Report').replace(/\.[^/.]+$/, '')}_summary.md`;
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
    <div className="results-studio-deck printable-report">
      {/* Top Action & Depth Control Banner */}
      <div className="deck-control-bar no-print">
        <div className="deck-bar-left">
          <div className="deck-badge-group">
            <span className="deck-success-chip">
              <CheckCircle2 size={13} /> Synthesis Ready
            </span>
            <span className="deck-depth-chip">
              <Sparkles size={12} /> {selectedLength.toUpperCase()}
            </span>
          </div>

          {/* Quick Depth Re-synthesizer */}
          {onLengthChange && (
            <div className="deck-depth-switcher" role="group" aria-label="Change summary depth">
              <span className="switcher-label">Depth:</span>
              {['short', 'medium', 'detailed'].map((len) => (
                <button
                  key={len}
                  type="button"
                  className={`switcher-pill-btn ${selectedLength === len ? 'is-active' : ''}`}
                  onClick={() => onLengthChange(len)}
                  disabled={isReanalyzing}
                  title={`Switch to ${len} depth`}
                >
                  {len.charAt(0).toUpperCase() + len.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Export Toolbar */}
        <div className="deck-actions-group">
          <button
            type="button"
            className={`action-pill-btn voice-btn ${isPlayingAudio ? 'is-speaking' : ''}`}
            onClick={toggleSpeech}
            title={isPlayingAudio ? 'Stop voice reader' : 'Listen to executive summary'}
          >
            {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isPlayingAudio ? 'Stop Voice' : 'Listen'}</span>
          </button>

          <button
            type="button"
            className="action-pill-btn copy-btn"
            onClick={handleCopyFull}
            title="Copy complete analysis to clipboard"
          >
            {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            className="action-pill-btn export-btn"
            onClick={handleDownloadMarkdown}
            title="Download report as Markdown file"
          >
            <Download size={14} />
            <span>Markdown</span>
          </button>

          <button
            type="button"
            className="action-pill-btn print-btn"
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            <Printer size={14} />
            <span>Print PDF</span>
          </button>

          <button
            type="button"
            className="action-pill-btn reset-btn"
            onClick={onReset}
            title="Analyze another document"
          >
            <RotateCcw size={14} />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Executive Metric KPI Bar */}
      <div className="executive-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box kpi-emerald">
            <TrendingDown size={18} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-number">{compressionRatio}%</span>
            <span className="kpi-label">Reading Time Saved</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box kpi-indigo">
            <ListChecks size={18} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-number">{keyPoints.length}</span>
            <span className="kpi-label">Critical Findings</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box kpi-violet">
            <Compass size={18} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-number">{mainIdeas.length}</span>
            <span className="kpi-label">Strategic Pillars</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box kpi-amber">
            <Lightbulb size={18} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-number">{suggestions.length}</span>
            <span className="kpi-label">Action Items</span>
          </div>
        </div>
      </div>

      {/* Document Metadata Strip */}
      <div className="studio-doc-meta-strip">
        <div className="meta-col">
          <FileText size={15} className="meta-svg" />
          <div className="meta-col-text">
            <span className="meta-dim-label">Source Document</span>
            <span className="meta-bold-val" title={fileMeta?.name}>
              {fileMeta?.name || 'Document'}
            </span>
          </div>
        </div>

        <div className="meta-col">
          <HardDrive size={15} className="meta-svg" />
          <div className="meta-col-text">
            <span className="meta-dim-label">Format & Size</span>
            <span className="meta-bold-val">
              {fileMeta?.isPdf ? 'PDF Document' : 'Image Scan'} • {formatBytes(fileMeta?.size)}
            </span>
          </div>
        </div>

        {fileMeta?.pageCount && (
          <div className="meta-col">
            <Layers size={15} className="meta-svg" />
            <div className="meta-col-text">
              <span className="meta-dim-label">Pages</span>
              <span className="meta-bold-val">{fileMeta.pageCount} page{fileMeta.pageCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        <div className="meta-col">
          <Clock size={15} className="meta-svg" />
          <div className="meta-col-text">
            <span className="meta-dim-label">Read Time</span>
            <span className="meta-bold-val">{readTime} min ({summaryWordCount} words)</span>
          </div>
        </div>

        {extractedText && (
          <div className="meta-col meta-raw-trigger no-print">
            <button
              type="button"
              className="meta-raw-btn"
              onClick={() => setShowRawText(!showRawText)}
            >
              <Eye size={13} />
              <span>{showRawText ? 'Hide OCR Text' : 'View OCR Text'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Raw Extracted Text Drawer */}
      {showRawText && extractedText && (
        <div className="studio-raw-drawer no-print">
          <div className="raw-drawer-bar">
            <div className="raw-bar-left">
              <FileCode size={15} />
              <span>Extracted Source Text ({formatBytes(extractedText.length)} • {rawWordCount} words)</span>
            </div>
            <button
              type="button"
              className="raw-bar-copy-btn"
              onClick={() => handleCopySnippet(extractedText, 'raw-text')}
            >
              {copiedIndex === 'raw-text' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedIndex === 'raw-text' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="raw-drawer-text">{extractedText}</pre>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="deck-tabs-bar no-print">
        <button
          type="button"
          className={`deck-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BookOpen size={14} />
          <span>Full Report Deck</span>
        </button>

        <button
          type="button"
          className={`deck-tab ${activeTab === 'points' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          <ListChecks size={14} />
          <span>Key Findings ({keyPoints.length})</span>
        </button>

        <button
          type="button"
          className={`deck-tab ${activeTab === 'themes' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('themes')}
        >
          <Compass size={14} />
          <span>Strategic Pillars ({mainIdeas.length})</span>
        </button>

        <button
          type="button"
          className={`deck-tab ${activeTab === 'actions' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <Lightbulb size={14} />
          <span>Action Items ({suggestions.length})</span>
        </button>
      </div>

      {/* Main Results Stack */}
      <div className="deck-sections-stack">
        {/* 1. EXECUTIVE SUMMARY */}
        {(activeTab === 'overview' || activeTab === 'summary') && (
          <section className="deck-panel summary-panel" aria-labelledby="summary-title">
            <div className="panel-header">
              <div className="panel-title-cluster">
                <div className="panel-icon-capsule capsule-blue">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 id="summary-title" className="panel-title">Smart Summary</h3>
                  <p className="panel-subtitle">Synthesized core narrative extracted by DocuLens AI</p>
                </div>
              </div>

              <div className="panel-actions no-print">
                <button
                  type="button"
                  className="mini-copy-action"
                  onClick={() => handleCopySnippet(summary, 'summary')}
                  title="Copy summary text"
                >
                  {copiedIndex === 'summary' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedIndex === 'summary' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className="panel-body">
              <p className="executive-text-flow">{summary}</p>
            </div>
          </section>
        )}

        {/* 2. KEY FINDINGS MATRIX */}
        {(activeTab === 'overview' || activeTab === 'points') && (
          <section className="deck-panel keypoints-panel" aria-labelledby="keypoints-title">
            <div className="panel-header">
              <div className="panel-title-cluster">
                <div className="panel-icon-capsule capsule-indigo">
                  <ListChecks size={18} />
                </div>
                <div>
                  <h3 id="keypoints-title" className="panel-title">Key Points</h3>
                  <p className="panel-subtitle">Quantitative data points, metrics, and qualitative discoveries</p>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <div className="findings-matrix-grid">
                {keyPoints.map((point, index) => (
                  <div key={index} className="finding-matrix-card">
                    <div className="finding-card-top">
                      <div className="finding-num-tag">
                        <span>#{index + 1}</span>
                      </div>
                      <button
                        type="button"
                        className="finding-copy-btn no-print"
                        onClick={() => handleCopySnippet(point, `kp-${index}`)}
                        title="Copy this finding"
                      >
                        {copiedIndex === `kp-${index}` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="finding-body-text">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. STRATEGIC PILLARS */}
        {(activeTab === 'overview' || activeTab === 'themes') && (
          <section className="deck-panel mainideas-panel" aria-labelledby="mainideas-title">
            <div className="panel-header">
              <div className="panel-title-cluster">
                <div className="panel-icon-capsule capsule-violet">
                  <Compass size={18} />
                </div>
                <div>
                  <h3 id="mainideas-title" className="panel-title">Main Ideas</h3>
                  <p className="panel-subtitle">Underlying principles, operational dynamics, and domain focus areas</p>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <div className="pillars-list">
                {mainIdeas.map((idea, index) => (
                  <div key={index} className="pillar-row-item">
                    <div className="pillar-index-box">
                      <span>{index + 1}</span>
                    </div>
                    <p className="pillar-text">{idea}</p>
                    <button
                      type="button"
                      className="pillar-copy-btn no-print"
                      onClick={() => handleCopySnippet(idea, `mi-${index}`)}
                      title="Copy strategic theme"
                    >
                      {copiedIndex === `mi-${index}` ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. ACTION ROADMAP */}
        {(activeTab === 'overview' || activeTab === 'actions') && (
          <section className="deck-panel suggestions-panel" aria-labelledby="suggestions-title">
            <div className="panel-header">
              <div className="panel-title-cluster">
                <div className="panel-icon-capsule capsule-amber">
                  <Lightbulb size={18} />
                </div>
                <div>
                  <h3 id="suggestions-title" className="panel-title">Improvement Suggestions</h3>
                  <p className="panel-subtitle">Interactive checklist: Click any item to acknowledge or complete</p>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <div className="action-roadmap-grid">
                {suggestions.map((suggestion, index) => {
                  const isChecked = !!checkedSuggestions[index];

                  return (
                    <div
                      key={index}
                      className={`action-card ${isChecked ? 'action-card-done' : ''}`}
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
                      <div className="action-check-box">
                        {isChecked ? (
                          <CheckSquare size={17} className="check-svg checked" />
                        ) : (
                          <Square size={17} className="check-svg" />
                        )}
                      </div>

                      <div className="action-text-cluster">
                        <div className="action-header-row">
                          <span className="action-step-tag">Deliverable #{index + 1}</span>
                          {isChecked && <span className="action-done-badge">Completed</span>}
                        </div>
                        <p className={`action-desc ${isChecked ? 'strike-text' : ''}`}>
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

      {/* Floating Bottom Reset */}
      <div className="deck-bottom-bar no-print">
        <button
          type="button"
          className="studio-reset-btn"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          <span>Synthesize Another Document</span>
        </button>
      </div>
    </div>
  );
}
