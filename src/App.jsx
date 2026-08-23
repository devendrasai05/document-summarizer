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
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock, BookOpen, Layers, CheckCircle } from 'lucide-react';

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
    // Create mock File representation for sample demo
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
    setProcessingMessage('Preparing document for extraction...');
    setProcessingPercentage(5);

    let extractedText = '';
    let pageCount = null;

    try {
      if (file.sample && file.sampleText) {
        // Direct extraction from sample document
        setProcessingStageIndex(1);
        setProcessingMessage('Parsing sample document...');
        setProcessingPercentage(40);
        await new Promise((res) => setTimeout(res, 400));
        extractedText = file.sampleText;
        pageCount = file.pageCount || 2;
      } else {
        const isPdf = isPdfFile(file);
        const isImg = isImageFile(file);

        // STAGE 1: File Reading & Text Extraction / OCR
        setProcessingStageIndex(1);

        if (isPdf) {
          setProcessingMessage('Reading PDF pages & extracting structured text...');
          const pdfResult = await extractTextFromPdf(file, (prog) => {
            setProcessingPercentage(Math.max(10, Math.min(60, prog.percentage)));
            if (prog.message) setProcessingMessage(prog.message);
          });
          extractedText = pdfResult.text;
          pageCount = pdfResult.pageCount;
        } else if (isImg) {
          setProcessingMessage('Running OCR on image to detect typography...');
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

      // STAGE 2: Analyzing Content Structure
      setProcessingStageIndex(2);
      setProcessingMessage('Analyzing document structure and vocabulary...');
      setProcessingPercentage(65);
      await new Promise((res) => setTimeout(res, 350));

      // STAGE 3: AI Generation via Groq API
      setProcessingStageIndex(3);
      setProcessingMessage(`Generating ${summaryLength.toUpperCase()} summary with AI...`);
      setProcessingPercentage(75);

      const summaryResponse = await generateSummary(extractedText, summaryLength);
      setProcessingPercentage(95);

      // STAGE 4: Finalizing
      setProcessingStageIndex(4);
      setProcessingMessage('Structuring insights and recommendations...');
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
      console.error('Document analysis failure:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing the document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-generate summary when depth is toggled directly on results screen
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
    <div className="app-layout">
      {/* Top Navigation / Header */}
      <Header />

      <main className="main-content">
        <div className="content-container">
          {/* Main Hero Banner */}
          {!result && (
            <div className="hero-intro-section">
              <div className="hero-pill">
                <Sparkles size={14} className="hero-pill-icon" />
                <span>Next-Gen Document Intelligence 2.0</span>
              </div>
              <h1 className="main-headline">
                Transform Complex Documents into <span className="gradient-text">Actionable Executive Intelligence</span>
              </h1>
              <p className="main-subheadline">
                Upload research papers, PDF reports, or image scans to extract typography, synthesize multi-level summaries,
                isolate critical takeaways, and receive targeted improvement roadmaps.
              </p>
            </div>
          )}

          {/* Error Alert Display */}
          <ErrorAlert
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            onRetry={file ? handleStartAnalysis : null}
          />

          {/* If Result exists, show Upgraded Results Dashboard */}
          {result ? (
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
            <div className="workflow-card">
              {/* Step 1: Upload */}
              <div className="step-block">
                <div className="step-indicator-row">
                  <div className="step-num-badge">1</div>
                  <h2 className="step-title">Upload Document or Image</h2>
                </div>
                <UploadArea
                  selectedFile={file}
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  onSelectSample={handleSelectSample}
                  disabled={isProcessing}
                />
              </div>

              {/* Step 2: Summary Options */}
              <div className="step-block">
                <div className="step-indicator-row">
                  <div className="step-num-badge">2</div>
                  <h2 className="step-title">Select Analysis Depth</h2>
                </div>
                <SummaryOptions
                  selectedLength={summaryLength}
                  onChange={setSummaryLength}
                  disabled={isProcessing}
                />
              </div>

              {/* Step 3: Action Button or Processing State */}
              <div className="step-action-zone">
                {isProcessing ? (
                  <ProcessingStatus
                    currentStageIndex={processingStageIndex}
                    statusMessage={processingMessage}
                    percentage={processingPercentage}
                  />
                ) : (
                  <button
                    type="button"
                    className="analyze-cta-btn"
                    disabled={!file || isProcessing}
                    onClick={handleStartAnalysis}
                  >
                    <Sparkles size={20} className="cta-icon" />
                    <span>Synthesize Document with AI</span>
                    <ArrowRight size={18} className="cta-arrow" />
                  </button>
                )}
              </div>

              {/* Security & Feature Guarantees */}
              <div className="trust-footer-row">
                <div className="trust-item">
                  <ShieldCheck size={16} />
                  <span>Private In-Browser PDF & OCR Extraction</span>
                </div>
                <div className="trust-item">
                  <Lock size={16} />
                  <span>Server-Side Isolated Security</span>
                </div>
                <div className="trust-item">
                  <Zap size={16} />
                  <span>Sub-Second Groq LLaMA Inference</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer-bar no-print">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} BriefCraft AI – High-Performance Document Synthesis Platform</p>
          <div className="footer-tech-stack">
            <span>React 18</span>
            <span className="dot">•</span>
            <span>Vite</span>
            <span className="dot">•</span>
            <span>PDF.js</span>
            <span className="dot">•</span>
            <span>Tesseract OCR</span>
            <span className="dot">•</span>
            <span>Groq LLaMA 3.3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
