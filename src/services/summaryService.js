/**
 * Client service to communicate with the serverless /api/summarize endpoint
 */

/**
 * Call serverless /api/summarize endpoint
 * @param {string} text - Extracted document text
 * @param {'short'|'medium'|'detailed'} length - Summary depth
 * @returns {Promise<{ summary: string, keyPoints: string[], mainIdeas: string[], suggestions: string[] }>}
 */
export async function generateSummary(text, length = 'medium') {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Document text is empty. Cannot generate summary without content.');
  }

  const endpoint = '/api/summarize';

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text.trim(),
        length: length.toLowerCase()
      })
    });
  } catch (netErr) {
    throw new Error(
      `Unable to connect to the summarization API (${netErr.message}). Ensure the server or 'npm run dev' is running.`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`The server returned an unparseable response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Server responded with status ${response.status}`;
    throw new Error(errorMsg);
  }

  // Validate expected payload structure
  if (!data || typeof data.summary !== 'string') {
    throw new Error('Invalid summary structure returned by the server.');
  }

  return {
    summary: data.summary,
    keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
    mainIdeas: Array.isArray(data.mainIdeas) ? data.mainIdeas : [],
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : []
  };
}
