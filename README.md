# BriefCraft AI – Intelligent Document Synthesis Platform

**Live Production Deployment:** [https://documind-five-kappa.vercel.app](https://documind-five-kappa.vercel.app)  
**GitHub Repository:** [https://github.com/devendrasai05/document-summarizer](https://github.com/devendrasai05/document-summarizer)

**BriefCraft AI** is an ultra-modern, production-grade AI document intelligence platform built for automated multi-page extraction, executive summarization, key point isolation, and actionable improvement recommendations.

---

## 🌟 Key Features & UX Innovations

- **Rebranded & Polished Experience**: Clean **BriefCraft AI** SaaS interface with micro-interactions, ambient glow aesthetics, and fully responsive layout.
- **Instant Demo Mode**: Pre-loaded executive whitepaper and financial report samples for one-click live evaluation.
- **Audio Voice Reader (Text-to-Speech)**: Integrated in-browser speech synthesis to listen to executive summaries aloud with soundwave animation.
- **Multi-Format Document Ingestion**:
  - Drag-and-drop and file browser for PDF (`.pdf`), JPEG (`.jpg`, `.jpeg`), and PNG (`.png`).
  - Image thumbnails and validation alerts for corrupt files or files exceeding 10 MB.
- **In-Browser Text Extraction & OCR**:
  - **PDFs**: Client-side extraction via `pdfjs-dist` preserving coordinate spacing and page counts.
  - **Images**: In-browser OCR via `Tesseract.js` with real-time recognition progress tracking.
- **Dynamic Analysis Depth Switcher**:
  - Select between **Short** (concise overview), **Medium** (balanced executive brief), and **Detailed** (in-depth deep dive).
  - Re-generate summary depths instantly from the results dashboard without re-uploading!
- **Interactive Action Items Checklist**: Check off recommendations as you implement them with visual strikethrough states.
- **Multi-Format Export**:
  - One-click copy analysis to clipboard.
  - One-click Markdown (`.md`) report download.
  - Print / Save as PDF (`@media print` clean executive stylesheet).
  - Raw extracted text drawer with character counter and copy tool.

- **High-Fidelity Text Extraction & OCR**:
  - **PDFs**: Client-side multi-page text extraction using `pdfjs-dist` with coordinate-aware line break reconstruction and page counting.
  - **Images**: In-browser Optical Character Recognition (OCR) powered by `Tesseract.js` with live percentage tracking and progress status.

- **Configurable Summary Depths**:
  - **Short**: Quick 2-3 sentence overview + 3 punchy takeaways for rapid scanning.
  - **Medium** *(Default)*: Balanced, thorough 1-2 paragraph executive summary + 4-5 key insights + 3-4 suggestions.
  - **Detailed**: Comprehensive multi-paragraph deep-dive breakdown + 6-8 key points + 4-6 strategic ideas and actionable suggestions.

- **Strict Structured JSON Schema**:
  - Guaranteed response format: `summary`, `keyPoints`, `mainIdeas`, and `suggestions`.
  - Robust server-side JSON sanitizer with automated code block stripping and fallback parsing.

- **SaaS Results Dashboard**:
  - Metadata strip displaying document name, format, file size, page count, and estimated reading time.
  - One-click copy analysis to clipboard.
  - One-click export to Markdown (`.md`).
  - Seamless "Analyze Another Document" reset button.

- **Enterprise Security**:
  - Zero client-side API key exposure.
  - Serverless API route (`/api/summarize`) isolated on the backend.
  - Safe payload truncation (~40,000 characters) to prevent token window overflow.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite 6 | Modern reactive UI & lightning-fast build tooling |
| **Styling** | Modern CSS (Vanilla) | Custom design system, CSS variables, responsive grid |
| **Icons** | Lucide React | Clean, modern feather-style iconography |
| **PDF Extraction** | `pdfjs-dist` | In-browser multi-page PDF text extraction |
| **OCR Engine** | `tesseract.js` | In-browser WebAssembly Optical Character Recognition |
| **AI Backend** | Vercel Serverless (`api/summarize.js`) | Isolated server-side function invoking Groq API |
| **AI Model** | Groq LLaMA 3.3 70B / 3.1 8B | Sub-second high-precision structured JSON inference |
| **Deployment** | Vercel | Production-ready edge deployment |

---

## 📁 Project Architecture

```
DocuMind/
├── api/
│   └── summarize.js           # Serverless Function (Isolated Groq AI integration)
├── public/
│   └── favicon.svg            # Custom DocuMind SVG favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx         # App header, branding & system badges
│   │   ├── UploadArea.jsx     # Drag & drop upload area with validation
│   │   ├── SummaryOptions.jsx # Short, Medium, Detailed selectable cards
│   │   ├── ProcessingStatus.jsx# Step-by-step progress tracking & progress bar
│   │   ├── SummaryResults.jsx # Results dashboard (summary, points, ideas, suggestions)
│   │   └── ErrorAlert.jsx     # Dismissible accessible error alerts
│   ├── services/
│   │   ├── pdfService.js      # pdfjs-dist extraction (spacing, page count, progress)
│   │   ├── ocrService.js      # Tesseract.js OCR (logger, progress, text formatting)
│   │   └── summaryService.js  # Client-side API caller to /api/summarize
│   ├── utils/
│   │   └── fileUtils.js       # File size formatting, type validation, word counts
│   ├── App.jsx                # Main application state machine & orchestration
│   ├── main.jsx               # React entry point
│   └── index.css              # Modern SaaS CSS design system & responsive rules
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules (protects .env.local)
├── index.html                 # Main HTML template with Google Fonts
├── package.json               # Dependencies and scripts
├── vercel.json                # Vercel routing configuration
├── vite.config.js             # Vite config with integrated dev API middleware
└── README.md                  # Comprehensive project documentation
```

---

## 🔄 How the Application Processes Documents

```
[User Uploads Document (PDF / Image)]
                 ↓
[Client-Side File Validation (Type, 10MB Limit, Non-empty)]
                 ↓
   ┌─────────────┴─────────────┐
   ↓                           ↓
[PDF Text Extraction]   [Image OCR Extraction]
(pdfjs-dist worker)     (Tesseract.js worker)
   └─────────────┬─────────────┘
                 ↓
[Payload Sanitization & Character Safeguard]
                 ↓
[POST /api/summarize (Serverless Endpoint)]
                 ↓
[Groq AI Model Inference (LLaMA 3.3 70B / 3.1 8B)]
                 ↓
[JSON Parsing, Sanitization & Schema Validation]
                 ↓
[Interactive Results Dashboard (Summary, Key Points, Ideas, Suggestions)]
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- A free **Groq API Key** (obtain at [https://console.groq.com/keys](https://console.groq.com/keys))

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

### 4. Run Local Development Server
DocuMind comes with built-in development API middleware inside Vite, so you can test both the frontend and `/api/summarize` instantly:
```bash
npm run dev
```
Open your browser and visit: `http://localhost:3000`

### 5. Alternative: Run with Vercel CLI
If you have the Vercel CLI installed (`npm i -g vercel`), you can run the app with Vercel's local runtime:
```bash
vercel dev
```

---

## 🚢 Deployment to Vercel

1. Push the repository to GitHub / GitLab / Bitbucket.
2. Import the repository into your **Vercel Dashboard**.
3. In the project settings, navigate to **Environment Variables** and add:
   - **Key**: `GROQ_API_KEY`
   - **Value**: `gsk_your_groq_api_key`
4. Click **Deploy**. Vercel will automatically build the Vite frontend and deploy `api/summarize.js` as a Serverless Function.

---

## 🧪 Testing & Quality Verification

### Run Production Build
```bash
npm run build
```
Ensures all JSX, CSS, PDF worker imports, and dependencies bundle cleanly without errors.

### Test Scenarios Covered
1. **PDF Document Upload**: Extracts text across all pages and renders page counts.
2. **Image OCR Upload**: Extracts typography from JPG/PNG images with real-time recognition percentage.
3. **Invalid File Handling**: Gracefully rejects unsupported extensions and files over 10 MB.
4. **Summary Depth Testing**: Validates structured outputs for `short`, `medium`, and `detailed` settings.
5. **Error Recovery**: Handles missing API keys, rate limits, and network disruptions gracefully with retry actions.

---

## ⚠️ Limitations & Future Improvements

- **Scanned Multi-Page PDFs**: In the current implementation, scanned PDFs without embedded text streams require image conversion for OCR. Future improvement: automated per-page canvas rendering to run OCR directly on scanned PDF pages.
- **Multilingual OCR & Translation**: Currently configured for English (`eng`). Future improvement: dynamic language selection for multi-lingual OCR (Spanish, French, German, Japanese, etc.).
- **Interactive Document Q&A (RAG)**: Future enhancement to allow users to ask follow-up questions in a conversational side-panel against the analyzed document.

---

## 📄 License
MIT License. Created for Software Engineering Technical Assessment.
