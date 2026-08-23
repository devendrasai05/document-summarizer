import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle, CheckCircle2, Sparkles, Zap, ArrowUpRight } from 'lucide-react';
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
    <div className="upload-control-block">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {!selectedFile ? (
        <div className="upload-interactive-wrapper">
          {/* Main Dropzone Box */}
          <div
            className={`studio-dropzone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
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
            aria-label="Upload document area"
          >
            <div className="dropzone-ambient-glow"></div>
            
            <div className="dropzone-icon-box">
              <UploadCloud className="dropzone-svg-icon" size={32} />
              <div className="dropzone-dot"></div>
            </div>

            <div className="dropzone-text-group">
              <h4 className="dropzone-headline">
                <span className="dropzone-action-text">Upload Document</span> or drag & drop
              </h4>
              <p className="dropzone-sub">
                PDF reports, whitepapers, contracts, invoices & high-res image scans
              </p>
            </div>

            <div className="dropzone-format-tags">
              <span className="format-tag tag-pdf">
                <FileText size={12} /> PDF
              </span>
              <span className="format-tag tag-img">
                <ImageIcon size={12} /> JPG / PNG
              </span>
              <span className="format-tag tag-limit">Max 10MB</span>
            </div>
          </div>

          {/* Quick Demo Document Presets */}
          {onSelectSample && (
            <div className="quick-presets-box">
              <div className="presets-header">
                <Sparkles size={13} className="presets-sparkle-icon" />
                <span>Instant Demo Presets:</span>
              </div>
              <div className="presets-button-grid">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    className="preset-pill-btn"
                    onClick={() => onSelectSample(doc)}
                    disabled={disabled}
                    title={doc.subtitle}
                  >
                    <div className="preset-pill-left">
                      <Zap size={13} className="preset-zap" />
                      <span className="preset-title">{doc.title}</span>
                    </div>
                    <ArrowUpRight size={13} className="preset-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="active-document-card">
          <div className="active-doc-main">
            {imagePreviewUrl ? (
              <div className="active-doc-thumb">
                <img src={imagePreviewUrl} alt="Thumbnail preview" />
              </div>
            ) : (
              <div className={`active-doc-icon-badge ${isPdfFile(selectedFile) ? 'pdf-badge' : 'img-badge'}`}>
                {isPdfFile(selectedFile) ? <FileText size={24} /> : <ImageIcon size={24} />}
              </div>
            )}

            <div className="active-doc-details">
              <div className="active-doc-name-row">
                <span className="active-doc-name" title={selectedFile.name}>
                  {selectedFile.displayName || selectedFile.name}
                </span>
                <span className="active-doc-status">
                  <CheckCircle2 size={12} /> Ready
                </span>
              </div>

              <div className="active-doc-meta-row">
                <span className="doc-meta-size">{formatBytes(selectedFile.size)}</span>
                <span className="doc-meta-dot">•</span>
                <span className="doc-meta-type">
                  {isPdfFile(selectedFile) ? 'PDF Document' : 'Image Scan'}
                </span>
                {selectedFile.sample && (
                  <>
                    <span className="doc-meta-dot">•</span>
                    <span className="doc-meta-sample-badge">Sample Demo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              className="active-doc-remove-btn"
              onClick={handleRemove}
              title="Remove file"
              aria-label="Remove selected file"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {validationError && (
        <div className="upload-validation-banner" role="alert">
          <AlertCircle size={15} className="validation-svg" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
