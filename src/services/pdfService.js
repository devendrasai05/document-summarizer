import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Extract readable text from a PDF file using pdfjs-dist
 * @param {File} file - PDF file object
 * @param {Function} onProgress - Callback (progressObj) => void
 * @returns {Promise<{ text: string, pageCount: number, characterCount: number }>}
 */
export async function extractTextFromPdf(file, onProgress = () => {}) {
  if (!file) {
    throw new Error('No PDF file provided for extraction.');
  }

  onProgress({
    stage: 'reading',
    message: 'Loading PDF document...',
    currentPage: 0,
    totalPages: 0,
    percentage: 5
  });

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false
    });

    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;

    if (totalPages === 0) {
      throw new Error('The PDF document contains no pages.');
    }

    onProgress({
      stage: 'extracting',
      message: `Document loaded (${totalPages} page${totalPages > 1 ? 's' : ''}). Extracting text...`,
      currentPage: 0,
      totalPages,
      percentage: 15
    });

    let fullText = '';
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Assemble text items into structured lines
      let lastY;
      let pageStr = '';

      for (const item of textContent.items) {
        if (!item.str) continue;

        // If Y coordinate differs substantially, it is a new line
        if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 6) {
          pageStr += '\n';
        } else if (pageStr.length > 0 && !pageStr.endsWith('\n') && !pageStr.endsWith(' ')) {
          pageStr += ' ';
        }

        pageStr += item.str;
        lastY = item.transform[5];
      }

      pageTexts.push(pageStr.trim());

      const progressPercent = Math.min(85, Math.round(15 + (pageNum / totalPages) * 70));
      onProgress({
        stage: 'extracting',
        message: `Extracted page ${pageNum} of ${totalPages}...`,
        currentPage: pageNum,
        totalPages,
        percentage: progressPercent
      });
    }

    fullText = pageTexts.join('\n\n').trim();

    // Clean up excessive repeated newlines and whitespace
    fullText = fullText.replace(/\n{3,}/g, '\n\n');

    if (!fullText || fullText.trim().length < 10) {
      throw new Error(
        'No readable text could be extracted from this PDF. It may be a scanned or image-only document. Please upload it as an image (JPG/PNG) to enable OCR text recognition.'
      );
    }

    onProgress({
      stage: 'complete',
      message: `Successfully extracted text from ${totalPages} page${totalPages > 1 ? 's' : ''}.`,
      currentPage: totalPages,
      totalPages,
      percentage: 90
    });

    return {
      text: fullText,
      pageCount: totalPages,
      characterCount: fullText.length
    };
  } catch (error) {
    if (error.name === 'PasswordException') {
      throw new Error('This PDF is password protected. Please unlock the file before uploading.');
    }
    if (error.name === 'InvalidPDFException') {
      throw new Error('The PDF file is corrupted or improperly formatted.');
    }
    throw error;
  }
}
