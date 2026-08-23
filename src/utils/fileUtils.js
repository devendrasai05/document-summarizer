/**
 * Utility functions for file validation, formatting, and handling
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const SUPPORTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

/**
 * Format bytes into human-readable string (KB, MB, etc.)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Check if a file is a PDF
 */
export function isPdfFile(file) {
  if (!file) return false;
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Check if a file is an image
 */
export function isImageFile(file) {
  if (!file) return false;
  const isMimeImage = file.type.startsWith('image/') && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
  const isExtImage = /\.(jpg|jpeg|png)$/i.test(file.name);
  return isMimeImage || isExtImage;
}

/**
 * Validate an uploaded file against size and type constraints
 * Returns { valid: boolean, error: string | null }
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check empty file
  if (file.size === 0) {
    return {
      valid: false,
      error: `The file "${file.name}" appears to be empty (0 bytes). Please upload a valid document.`
    };
  }

  // Check maximum file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 10 MB limit (${formatBytes(file.size)}). Please choose a smaller file.`
    };
  }

  // Check supported file formats
  const isPdf = isPdfFile(file);
  const isImg = isImageFile(file);

  if (!isPdf && !isImg) {
    return {
      valid: false,
      error: `Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG document.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Estimate word count in a text string
 */
export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculate reading time in minutes
 */
export function estimateReadingTime(text, wpm = 200) {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wpm));
}
