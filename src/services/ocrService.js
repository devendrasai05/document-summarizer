import { createWorker } from 'tesseract.js';

/**
 * Extract text from an image file using Tesseract.js OCR
 * @param {File|Blob} imageFile - Image file object (JPG, JPEG, PNG)
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{ text: string, confidence: number }>}
 */
export async function extractTextFromImage(imageFile, onProgress = () => {}) {
  if (!imageFile) {
    throw new Error('No image file provided for OCR processing.');
  }

  onProgress({
    stage: 'ocr-init',
    message: 'Initializing OCR optical recognition engine...',
    percentage: 5
  });

  let worker = null;

  try {
    worker = await createWorker('eng', 1, {
      logger: progressEvent => {
        if (progressEvent.status === 'recognizing text') {
          const rawPct = progressEvent.progress || 0;
          const mappedPct = Math.min(85, Math.round(15 + rawPct * 70));
          onProgress({
            stage: 'ocr-processing',
            status: progressEvent.status,
            message: `Optical Character Recognition (${Math.round(rawPct * 100)}%)...`,
            percentage: mappedPct
          });
        } else if (progressEvent.status) {
          onProgress({
            stage: 'ocr-init',
            status: progressEvent.status,
            message: `Preparing OCR (${progressEvent.status})...`,
            percentage: 10
          });
        }
      }
    });

    onProgress({
      stage: 'ocr-recognize',
      message: 'Processing image pixels and extracting text...',
      percentage: 20
    });

    const result = await worker.recognize(imageFile);
    const text = result?.data?.text ? result.data.text.trim() : '';
    const confidence = result?.data?.confidence || 0;

    if (!text || text.length < 5) {
      throw new Error(
        'Could not detect any clear readable text in this image. Please ensure the image is high resolution, well-lit, and contains legible typography.'
      );
    }

    onProgress({
      stage: 'complete',
      message: 'OCR extraction complete!',
      percentage: 90
    });

    return {
      text,
      confidence
    };
  } catch (error) {
    throw error;
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (termErr) {
        console.warn('Worker termination warning:', termErr);
      }
    }
  }
}
