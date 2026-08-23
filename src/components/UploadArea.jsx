import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { formatBytes, isPdfFile, isImageFile, validateFile } from '../utils/fileUtils';
import { SAMPLE_DOCUMENTS } from '../utils/sampleDocuments';

export default function UploadArea({
  selectedFile,
  onFileSelect,
  onFileRemove,
  onSelectSample,
  disabled
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError(null);

    // Create thumbnail preview if image
    if (isImageFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }

    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBoxClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setValidationError(null);
    setImagePreviewUrl(null);
    onFileRemove();
  };

  return (
    <div className="upload-section">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {!selectedFile ? (
        <div className="upload-flow-wrapper">
          <div
            className={`dropzone-container ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBoxClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBoxClick();
              }
            }}
            aria-label="Upload document drag and drop area"
          >
            <div className="upload-glow-backdrop"></div>
            
            <div className="upload-icon-wrapper">
              <UploadCloud className="upload-icon" size={36} />
              <div className="upload-spark-dot"></div>
            </div>

            <div className="upload-text-content">
              <h3 className="upload-title">
                <span className="upload-highlight">Click to browse</span> or drop your document here
              </h3>
              <p className="upload-subtitle">
                AI parses PDF documents, technical papers, contracts, invoices, and high-res image scans
              </p>
            </div>

            <div className="file-badges-row">
              <span className="file-type-pill">
                <FileText size={13} className="pill-pdf-icon" /> PDF Document
              </span>
              <span className="file-type-pill">
                <ImageIcon size={13} className="pill-img-icon" /> JPG, PNG Scan
              </span>
              <span className="file-limit-pill">Up to 10 MB</span>
            </div>
          </div>

          {/* Quick Sample Document Selector */}
          {onSelectSample && (
            <div className="sample-docs-panel">
              <div className="sample-docs-header">
                <Sparkles size={14} className="sample-sparkle" />
                <span>Or evaluate instantly with sample documents:</span>
              </div>
              <div className="sample-docs-grid">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className="sample-doc-card"
                    onClick={() => onSelectSample(doc)}
                    disabled={disabled}
                  >
                    <div className="sample-doc-icon-box">
                      <Zap size={14} />
                    </div>
                    <div className="sample-doc-text">
                      <span className="sample-doc-title">{doc.title}</span>
                      <span className="sample-doc-sub">{doc.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="selected-file-card">
          <div className="file-info-group">
            {imagePreviewUrl ? (
              <div className="file-thumbnail-preview">
                <img src={imagePreviewUrl} alt="Document preview" />
              </div>
            ) : (
              <div className={`file-icon-box ${isPdfFile(selectedFile) ? 'pdf-type' : 'img-type'}`}>
                {isPdfFile(selectedFile) ? <FileText size={26} /> : <ImageIcon size={26} />}
              </div>
            )}

            <div className="file-meta">
              <div className="file-name-row">
                <span className="file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="file-status-badge">
                  <CheckCircle2 size={13} /> Ready for AI Synthesis
                </span>
              </div>
              <div className="file-details-row">
                <span className="file-size-text">{formatBytes(selectedFile.size)}</span>
                <span className="dot-separator">•</span>
                <span className="file-type-text">
                  {isPdfFile(selectedFile) ? 'PDF Document' : 'Image Scan'}
                </span>
                {selectedFile.sample && (
                  <>
                    <span className="dot-separator">•</span>
                    <span className="sample-tag">Sample Demo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              className="remove-file-button"
              onClick={handleRemove}
              title="Remove file"
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {validationError && (
        <div className="validation-error-alert" role="alert">
          <AlertCircle size={16} className="error-icon" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
