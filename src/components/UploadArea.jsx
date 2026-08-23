import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatBytes, isPdfFile, isImageFile, validateFile } from '../utils/fileUtils';

export default function UploadArea({ selectedFile, onFileSelect, onFileRemove, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError(null);
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
    // Reset file input value so user can re-select the same file if needed
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
          <div className="upload-icon-wrapper">
            <UploadCloud className="upload-icon" size={38} />
          </div>

          <div className="upload-text-content">
            <h3 className="upload-title">
              <span className="upload-highlight">Click to upload</span> or drag and drop
            </h3>
            <p className="upload-subtitle">
              Supports PDF documents, JPG, JPEG, and PNG images (up to 10 MB)
            </p>
          </div>

          <div className="file-badges-row">
            <span className="file-type-pill">
              <FileText size={13} /> PDF
            </span>
            <span className="file-type-pill">
              <ImageIcon size={13} /> JPG / PNG
            </span>
            <span className="file-limit-pill">Max 10 MB</span>
          </div>
        </div>
      ) : (
        <div className="selected-file-card">
          <div className="file-info-group">
            <div className={`file-icon-box ${isPdfFile(selectedFile) ? 'pdf-type' : 'img-type'}`}>
              {isPdfFile(selectedFile) ? <FileText size={26} /> : <ImageIcon size={26} />}
            </div>
            <div className="file-meta">
              <div className="file-name-row">
                <span className="file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="file-status-badge">
                  <CheckCircle2 size={13} /> Ready
                </span>
              </div>
              <div className="file-details-row">
                <span className="file-size-text">{formatBytes(selectedFile.size)}</span>
                <span className="dot-separator">•</span>
                <span className="file-type-text">
                  {isPdfFile(selectedFile) ? 'PDF Document' : 'Image Document'}
                </span>
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
