import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import SummaryOptions from './components/SummaryOptions';
import ProcessingStatus from './components/ProcessingStatus';
import SummaryResults from './components/SummaryResults';
import ErrorAlert from './components/ErrorAlert';
import { extractTextFromPdf } from './services/pdfService';
import { extractTextFromImage } from './services/ocrService';
import { generateSummary } from './services/summaryService';
import { isPdfFile, isImageFile } from './utils/fileUtils';
import { SAMPLE_DOCUMENTS } from './utils/sampleDocuments';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  FileSearch,
  BookOpen,
  ListChecks,
  Compass,
  Lightbulb,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingPercentage, setProcessingPercentage] = useState(0);
  const [result, setResult] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [extractedRawText, setExtractedRawText] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);
    setExtractedRawText('');
  };

  const handleSelectSample = (sampleDoc) => {
    const mockFile = new File([sampleDoc.text], `${sampleDoc.id}.txt`, { type: 'text/plain' });
    mockFile.sample = true;
    mockFile.displayName = sampleDoc.title;
    mockFile.pageCount = sampleDoc.pageCount;
    mockFile.sampleText = sampleDoc.text;

    setFile(mockFile);
    setErrorMessage(null);
    setResult(null);
    setExtractedRawText(sampleDoc.text);
  };

  const handleFileRemove = () => {
    if (isProcessing) return;
    setFile(null);
    setResult(null);
    setFileMeta(null);
    setExtractedRawText('');
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!file || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);
    setProcessingStageIndex(0);
    setProcessingMessage('Preparing document payload & security sandbox...');
    setProcessingPercentage(5);

    let extractedText = '';
    let pageCount = null;

    try {
      if (file.sample && file.sampleText) {
        setProcessingStageIndex(1);
        setProcessingMessage('Parsing sample document streams...');
        setProcessingPercentage(40);
        await new Promise((res) => setTimeout(res, 350));
        extractedText = file.sampleText;
        pageCount = file.pageCount || 2;
      } else {
        const isPdf = isPdfFile(file);
        const isImg = isImageFile(file);

        setProcessingStageIndex(1);

        if (isPdf) {
          setProcessingMessage('Parsing multi-page PDF & extracting structured layout...');
          const pdfResult = await extractTextFromPdf(file, (prog) => {
            setProcessingPercentage(Math.max(10, Math.min(60, prog.percentage)));
            if (prog.message) setProcessingMessage(prog.message);
          });
          extractedText = pdfResult.text;
          pageCount = pdfResult.pageCount;
        } else if (isImg) {
          setProcessingMessage('Running WebAssembly OCR to extract typography...');
          const ocrResult = await extractTextFromImage(file, (prog) => {
            setProcessingPercentage(Math.max(10, Math.min(60, prog.percentage)));
            if (prog.message) setProcessingMessage(prog.message);
          });
          extractedText = ocrResult.text;
        } else {
          throw new Error('Unsupported file format. Please upload a PDF or image.');
        }
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No readable text could be extracted from this document.');
      }

      setExtractedRawText(extractedText);

      // STAGE 2: Structural Analysis
      setProcessingStageIndex(2);
      setProcessingMessage('Mapping lexical hierarchy & semantic vectors...');
      setProcessingPercentage(65);
      await new Promise((res) => setTimeout(res, 300));

      // STAGE 3: Groq AI Synthesis
      setProcessingStageIndex(3);
      setProcessingMessage(`Synthesizing ${summaryLength.toUpperCase()} executive summary via Groq...`);
      setProcessingPercentage(75);

      const summaryResponse = await generateSummary(extractedText, summaryLength);
      setProcessingPercentage(95);

      // STAGE 4: Output Validation
      setProcessingStageIndex(4);
      setProcessingMessage('Validating JSON schema & structuring intelligence deck...');
      setProcessingPercentage(100);
      await new Promise((res) => setTimeout(res, 250));

      setFileMeta({
        name: file.displayName || file.name,
        size: file.size,
        type: file.type,
        isPdf: file.sample ? true : isPdfFile(file),
        pageCount,
        characterCount: extractedText.length
      });

      setResult(summaryResponse);
    } catch (err) {
      console.error('DocuLens analysis failure:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing the document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLengthChangeFromResults = async (newLength) => {
    if (newLength === summaryLength || !extractedRawText || isReanalyzing) return;

    setSummaryLength(newLength);
    setIsReanalyzing(true);
    setErrorMessage(null);

    try {
      const summaryResponse = await generateSummary(extractedRawText, newLength);
      setResult(summaryResponse);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to re-generate summary with new depth.');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setFileMeta(null);
    setExtractedRawText('');
    setErrorMessage(null);
    setIsProcessing(false);
    setIsReanalyzing(false);
    setProcessingPercentage(0);
    setProcessingStageIndex(0);
  };

  return (
    <div className="doculens-app">
      {/* Top Application Header */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="studio-workspace">
        <div className="studio-canvas">
          {/* Global Alert Notification */}
          <ErrorAlert
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            onRetry={file ? handleStartAnalysis : null}
          />

          {/* Dual-Pane Studio Grid */}
          <div className={`studio-split-grid ${result ? 'has-results' : ''}`}>
            {/* =========================================================
                LEFT PANE: Control Center & Document Configuration
               ========================================================= */}
            <aside className="studio-left-pane no-print">
              <div className="pane-card-frame">
                <div className="pane-header-row">
                  <div className="pane-title-group">
                    <span className="pane-step-counter">1</span>
                    <h2 className="pane-title">Document Ingestion</h2>
                  </div>
                  <span className="pane-secure-tag">
                    <Lock size={11} /> Sandboxed
                  </span>
                </div>

                {/* Upload Zone */}
                <UploadArea
                  selectedFile={file}
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  onSelectSample={handleSelectSample}
                  disabled={isProcessing}
                />

                {/* Depth Selection */}
                <div className="pane-depth-section">
                  <div className="pane-title-group">
                    <span className="pane-step-counter">2</span>
                    <h2 className="pane-title">Synthesis Depth</h2>
                  </div>
                  <SummaryOptions
                    selectedLength={summaryLength}
                    onChange={setSummaryLength}
                    disabled={isProcessing}
                  />
                </div>

                {/* Action CTA */}
                <div className="pane-action-box">
                  <button
                    type="button"
                    className="studio-cta-btn"
                    disabled={!file || isProcessing}
                    onClick={handleStartAnalysis}
                  >
                    <Sparkles size={18} className="btn-sparkle-svg" />
                    <span>{result ? 'Re-Synthesize Document' : 'Synthesize with AI'}</span>
                    <ArrowRight size={16} className="btn-arrow-svg" />
                  </button>
                </div>

                {/* Trust Metrics */}
                <div className="pane-trust-strip">
                  <div className="trust-cell">
                    <ShieldCheck size={14} className="text-emerald" />
                    <span>In-Browser Extraction</span>
                  </div>
                  <div className="trust-cell">
                    <Zap size={14} className="text-amber" />
                    <span>Groq LLaMA 3.3</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* =========================================================
                RIGHT PANE: Live Executive Stage / Synthesis Deck
               ========================================================= */}
            <section className="studio-right-pane">
              {isProcessing ? (
                <ProcessingStatus
                  currentStageIndex={processingStageIndex}
                  statusMessage={processingMessage}
                  percentage={processingPercentage}
                />
              ) : result ? (
                <SummaryResults
                  result={result}
                  fileMeta={fileMeta}
                  selectedLength={summaryLength}
                  extractedText={extractedRawText}
                  onLengthChange={handleLengthChangeFromResults}
                  onReset={handleReset}
                  isReanalyzing={isReanalyzing}
                />
              ) : (
                /* Empty Stage Feature Showcase */
                <div className="empty-stage-card">
                  <div className="empty-stage-hero">
                    <div className="hero-emblem-box">
                      <FileSearch size={38} className="hero-emblem-icon" />
                      <div className="hero-emblem-ring"></div>
                    </div>

                    <h3 className="empty-stage-title">
                      Welcome to <span className="brand-highlight">DocuLens AI</span> Studio
                    </h3>

                    <p className="empty-stage-sub">
                      Upload a PDF report, research paper, or image scan on the left to extract text, synthesize
                      executive briefs, isolate key findings, and build actionable next steps.
                    </p>
                  </div>

                  {/* Capability Grid */}
                  <div className="stage-capabilities-grid">
                    <div className="cap-feature-card">
                      <div className="cap-feat-icon icon-blue">
                        <BookOpen size={18} />
                      </div>
                      <h4 className="cap-feat-title">Smart Summary</h4>
                      <p className="cap-feat-desc">
                        Synthesizes complex multi-page documents into digestible executive narratives.
                      </p>
                    </div>

                    <div className="cap-feature-card">
                      <div className="cap-feat-icon icon-indigo">
                        <ListChecks size={18} />
                      </div>
                      <h4 className="cap-feat-title">Key Points</h4>
                      <p className="cap-feat-desc">
                        Isolates vital facts, quantitative metrics, and core qualitative takeaways.
                      </p>
                    </div>

                    <div className="cap-feature-card">
                      <div className="cap-feat-icon icon-violet">
                        <Compass size={18} />
                      </div>
                      <h4 className="cap-feat-title">Main Ideas</h4>
                      <p className="cap-feat-desc">
                        Identifies overarching themes, operational models, and strategic focus areas.
                      </p>
                    </div>

                    <div className="cap-feature-card">
                      <div className="cap-feat-icon icon-amber">
                        <Lightbulb size={18} />
                      </div>
                      <h4 className="cap-feat-title">Improvement Suggestions</h4>
                      <p className="cap-feat-desc">
                        Generates a structured checklist of next steps with clickable completion states.
                      </p>
                    </div>
                  </div>

                  {/* Instant Demo Prompt */}
                  <div className="empty-stage-prompt-bar">
                    <Sparkles size={15} className="prompt-spark" />
                    <span>Tip: Click any <strong>Instant Demo Preset</strong> on the left to test the AI pipeline immediately.</span>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Clean Studio Footer */}
      <footer className="studio-footer no-print">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">DocuLens AI</span>
            <span className="footer-dot">•</span>
            <span className="footer-copyright">© {new Date().getFullYear()} Executive Intelligence Platform</span>
          </div>

          <div className="footer-right-tags">
            <span className="tag-pill">Vite 6</span>
            <span className="tag-pill">React 18</span>
            <span className="tag-pill">pdfjs-dist</span>
            <span className="tag-pill">Tesseract OCR</span>
            <span className="tag-pill">Groq LLaMA 3.3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
