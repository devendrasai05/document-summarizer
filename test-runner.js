import { formatBytes, validateFile, countWords, estimateReadingTime, isPdfFile, isImageFile } from './src/utils/fileUtils.js';
import summarizeHandler from './api/summarize.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing fileUtils ---');

  // Test formatBytes
  assert(formatBytes(0) === '0 Bytes', 'formatBytes(0)');
  assert(formatBytes(1024) === '1 KB', 'formatBytes(1024)');
  assert(formatBytes(1048576) === '1 MB', 'formatBytes(1048576)');
  assert(formatBytes(5242880) === '5 MB', 'formatBytes(5242880)');

  // Test word count & reading time
  const sampleText = 'This is a sample document text containing seven words.';
  assert(countWords(sampleText) === 9, 'countWords() counts accurately (9 words)');
  assert(estimateReadingTime(sampleText) === 1, 'estimateReadingTime() returns at least 1 min');

  // Test file type detection
  assert(isPdfFile({ name: 'report.pdf', type: 'application/pdf' }), 'isPdfFile with valid PDF');
  assert(!isPdfFile({ name: 'photo.png', type: 'image/png' }), 'isPdfFile returns false for PNG');
  assert(isImageFile({ name: 'photo.jpg', type: 'image/jpeg' }), 'isImageFile for JPEG');
  assert(isImageFile({ name: 'diagram.png', type: 'image/png' }), 'isImageFile for PNG');
  assert(!isImageFile({ name: 'data.csv', type: 'text/csv' }), 'isImageFile returns false for CSV');

  // Test validateFile
  const validPdf = { name: 'annual_report.pdf', type: 'application/pdf', size: 2 * 1024 * 1024 };
  assert(validateFile(validPdf).valid === true, 'validateFile accepts 2MB PDF');

  const validPng = { name: 'receipt.png', type: 'image/png', size: 500 * 1024 };
  assert(validateFile(validPng).valid === true, 'validateFile accepts 500KB PNG');

  const emptyFile = { name: 'empty.pdf', type: 'application/pdf', size: 0 };
  assert(validateFile(emptyFile).valid === false, 'validateFile rejects empty file (0 bytes)');

  const oversizedFile = { name: 'huge.pdf', type: 'application/pdf', size: 15 * 1024 * 1024 };
  assert(validateFile(oversizedFile).valid === false, 'validateFile rejects oversized file (>10MB)');

  const invalidType = { name: 'program.exe', type: 'application/x-msdownload', size: 1024 };
  assert(validateFile(invalidType).valid === false, 'validateFile rejects unsupported format');

  console.log('\n--- 2. Testing /api/summarize Serverless Endpoint ---');

  // Test Method Not Allowed (GET)
  let resMethodNotAllowed = createMockRes();
  await summarizeHandler({ method: 'GET', headers: {} }, resMethodNotAllowed);
  assert(resMethodNotAllowed.statusCode === 405, 'GET request returns HTTP 405 Method Not Allowed');

  // Test Empty Body / Missing text
  let resEmpty = createMockRes();
  await summarizeHandler({ method: 'POST', body: { text: '' }, headers: {} }, resEmpty);
  assert(resEmpty.statusCode === 400, 'Empty text returns HTTP 400 Bad Request');
  assert(resEmpty.data?.message?.includes('required'), 'Empty text includes helpful error message');

  // Test Missing API Key handling
  const prevApiKey = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  let resNoKey = createMockRes();
  await summarizeHandler({ method: 'POST', body: { text: 'Some document text', length: 'short' }, headers: {} }, resNoKey);
  assert(resNoKey.statusCode === 500, 'Missing GROQ_API_KEY returns HTTP 500');
  assert(resNoKey.data?.message?.includes('GROQ_API_KEY is not configured'), 'Helpful API key configuration guide provided');
  if (prevApiKey) process.env.GROQ_API_KEY = prevApiKey;

  console.log(`\n========================================`);
  console.log(`Tests Completed: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.data = payload; return this; },
    end() { return this; }
  };
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
