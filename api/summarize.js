/**
 * AI Provider Service: Groq
 * Isolated helper to communicate with the AI model via high-speed API.
 */
async function callGroqAI(apiKey, text, length) {
  const lengthInstructions = {
    short: {
      summary: 'Provide a concise, high-level summary in 2-3 clear sentences.',
      keyPoints: 'Provide exactly 3 punchy, high-impact bullet points.',
      mainIdeas: 'Provide 2 core overarching themes or takeaways.',
      suggestions: 'Provide 2 actionable improvement or follow-up suggestions based on the content.'
    },
    medium: {
      summary: 'Provide a balanced, thorough summary in 1-2 detailed paragraphs (approx. 80-120 words).',
      keyPoints: 'Provide 4-5 well-explained key bullet points.',
      mainIdeas: 'Provide 3-4 central ideas or strategic takeaways.',
      suggestions: 'Provide 3-4 actionable improvement recommendations or constructive suggestions.'
    },
    detailed: {
      summary: 'Provide a comprehensive, in-depth executive summary in 2-3 structured paragraphs covering context, details, and implications.',
      keyPoints: 'Provide 6-8 comprehensive key points detailing specific findings or sections.',
      mainIdeas: 'Provide 4-6 deep-dive main concepts or strategic themes.',
      suggestions: 'Provide 4-6 specific, practical, and highly actionable improvement suggestions.'
    }
  };

  const selectedLength = lengthInstructions[length] || lengthInstructions.medium;

  const systemPrompt = `You are DocuMind, an elite AI document analysis assistant.
Analyze the provided document text and produce a structured, high-value breakdown.

You must respond ONLY with a valid, parseable JSON object matching this exact schema:
{
  "summary": "string (the document summary)",
  "keyPoints": ["string (point 1)", "string (point 2)", "..."],
  "mainIdeas": ["string (main idea 1)", "string (main idea 2)", "..."],
  "suggestions": ["string (suggestion 1)", "string (suggestion 2)", "..."]
}

Guidelines for "${length.toUpperCase()}" depth:
- Summary: ${selectedLength.summary}
- Key Points: ${selectedLength.keyPoints}
- Main Ideas: ${selectedLength.mainIdeas}
- Suggestions: ${selectedLength.suggestions}

Rules:
- Return pure valid JSON only.
- Do not include markdown code block syntax (like \`\`\`json).
- If paragraphs are multiline, properly escape newlines using \\n.`;

  const userPrompt = `Document Content for Analysis:
"""
${text}
"""`;

  // Preferred models in priority order
  const preferredModels = [
    'llama-3.3-70b-versatile',
    'llama-3.3-70b-specdec',
    'deepseek-r1-distill-llama-70b',
    'llama-3.2-3b-preview',
    'llama-3.2-1b-preview',
    'llama-3.2-11b-vision-preview'
  ];

  // Dynamically query available models if possible
  let availableModels = preferredModels;
  try {
    const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (modelsRes.ok) {
      const modelsData = await modelsRes.json();
      if (modelsData?.data && Array.isArray(modelsData.data)) {
        const activeIds = new Set(modelsData.data.map(m => m.id));
        const matched = preferredModels.filter(id => activeIds.has(id));
        if (matched.length > 0) {
          availableModels = matched;
        } else {
          // Use any active text/chat model
          const fallbackList = modelsData.data
            .map(m => m.id)
            .filter(id => !id.includes('whisper') && !id.includes('tts') && !id.includes('guard'));
          if (fallbackList.length > 0) {
            availableModels = fallbackList;
          }
        }
      }
    }
  } catch (modErr) {
    console.warn('Could not dynamically list models, using fallback list:', modErr.message);
  }

  let lastError = null;

  for (const model of availableModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || `Groq API Error HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const responseContent = data?.choices?.[0]?.message?.content;
      if (responseContent) {
        return responseContent;
      }
    } catch (err) {
      console.warn(`Model ${model} call failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate summary from AI provider');
}

/**
 * Robust JSON Parser and sanitizer
 */
function cleanAndParseJSON(rawString) {
  if (!rawString || typeof rawString !== 'string') {
    throw new Error('Empty AI response received');
  }

  let text = rawString.trim();

  // Strip markdown code block wrappers if present (e.g. ```json ... ```)
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 1. Direct parse attempt
  try {
    const parsed = JSON.parse(text);
    if (validateSummarySchema(parsed)) return parsed;
  } catch {}

  // 2. Substring extraction attempt
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    const jsonSub = match[0];
    try {
      const parsed = JSON.parse(jsonSub);
      if (validateSummarySchema(parsed)) return parsed;
    } catch {}

    // 3. Sanitize unescaped control characters and linebreaks
    try {
      const sanitized = jsonSub.replace(/[\u0000-\u001F\u007F-\u009F]/g, c => {
        if (c === '\n') return '\\n';
        if (c === '\r') return '\\r';
        if (c === '\t') return '\\t';
        return '';
      });
      const parsed = JSON.parse(sanitized);
      if (validateSummarySchema(parsed)) return parsed;
    } catch {}
  }

  throw new Error('AI output could not be parsed into the expected JSON structure');
}

function validateSummarySchema(data) {
  return (
    data &&
    typeof data.summary === 'string' &&
    Array.isArray(data.keyPoints) &&
    Array.isArray(data.mainIdeas) &&
    Array.isArray(data.suggestions)
  );
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  // Set CORS headers for security and flexibility
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported on this endpoint.'
    });
  }

  // Parse body if not automatically parsed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid JSON payload in request body.'
      });
    }
  }

  const { text, length = 'medium' } = body || {};

  // 1. Validate request parameters
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Document text is required and cannot be empty.'
    });
  }

  const validLengths = ['short', 'medium', 'detailed'];
  const summaryLength = validLengths.includes(length?.toLowerCase()) ? length.toLowerCase() : 'medium';

  // 2. Validate API key
  let apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here' || apiKey.startsWith('gsk_your_')) {
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'GROQ_API_KEY is not configured on the server. Please add your Groq API key in .env.local or Vercel Environment Variables.'
    });
  }

  apiKey = apiKey.trim().replace(/^["']|["']$/g, '');

  // 3. Limit extremely large text safely to avoid token window overflow (~30,000 characters is ~7,500 tokens)
  const MAX_CHAR_LIMIT = 40000;
  let safeText = text.trim();
  if (safeText.length > MAX_CHAR_LIMIT) {
    safeText = safeText.slice(0, MAX_CHAR_LIMIT) + '\n\n[... Document truncated safely for summary generation ...]';
  }

  // 4. Call AI Provider and format response
  try {
    const rawResponse = await callGroqAI(apiKey, safeText, summaryLength);
    const structuredResult = cleanAndParseJSON(rawResponse);

    return res.status(200).json({
      success: true,
      summary: structuredResult.summary,
      keyPoints: structuredResult.keyPoints || [],
      mainIdeas: structuredResult.mainIdeas || [],
      suggestions: structuredResult.suggestions || []
    });
  } catch (error) {
    console.error('DocuMind Summarize Error:', error.message);

    const errorMessage = error.message || '';
    let userFriendlyMsg = errorMessage || 'Failed to generate document summary. Please try again.';
    let statusCode = 500;

    if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('invalid api key')) {
      userFriendlyMsg = 'Invalid Groq API key configured. Please verify your GROQ_API_KEY in Vercel settings.';
      statusCode = 401;
    } else if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) {
      userFriendlyMsg = 'AI rate limit reached. Please wait a few moments before submitting again.';
      statusCode = 429;
    } else if (errorMessage.includes('JSON')) {
      userFriendlyMsg = 'The AI model generated an unparseable response. Please retry.';
      statusCode = 502;
    }

    return res.status(statusCode).json({
      error: 'AI Processing Error',
      message: userFriendlyMsg
    });
  }
}
