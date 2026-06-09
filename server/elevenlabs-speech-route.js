const MAX_SPEECH_CHARACTERS = 1800;
const REQUEST_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const speechRequests = new Map();

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;"
  })[character]);
}

async function azureSpeech(text) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (!key || !region) return null;
  const voice = process.env.AZURE_SPEECH_VOICE || "en-IN-PrabhatNeural";
  const locale = process.env.AZURE_SPEECH_LOCALE || "en-IN";
  const ssml = `<speak version="1.0" xml:lang="${escapeXml(locale)}"><voice name="${escapeXml(voice)}"><prosody rate="-3%" pitch="-2%">${escapeXml(text)}</prosody></voice></speak>`;
  const providerResponse = await fetch(`https://${encodeURIComponent(region)}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/ssml+xml",
      "Ocp-Apim-Subscription-Key": key,
      "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
      "User-Agent": "TomCodex-AI-Interviewer"
    },
    body: ssml
  });
  if (!providerResponse.ok) throw new Error(`Azure Speech failed with status ${providerResponse.status}`);
  return {
    audio: Buffer.from(await providerResponse.arrayBuffer()),
    contentType: providerResponse.headers.get("content-type") || "audio/mpeg",
    provider: "azure",
    model: voice
  };
}

async function elevenLabsSpeech(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) return null;
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5";
  const providerResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      language_code: "en",
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.8,
        style: 0.25,
        use_speaker_boost: true
      }
    })
  });
  if (!providerResponse.ok) throw new Error(`ElevenLabs failed with status ${providerResponse.status}`);
  return {
    audio: Buffer.from(await providerResponse.arrayBuffer()),
    contentType: providerResponse.headers.get("content-type") || "audio/mpeg",
    provider: "elevenlabs",
    model: modelId
  };
}

export function registerElevenLabsSpeechRoute(app) {
  app.post("/api/voice/speak", async (request, response) => {
    const clientId = request.ip || request.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const recent = (speechRequests.get(clientId) || []).filter((timestamp) => now - timestamp < REQUEST_WINDOW_MS);
    if (recent.length >= MAX_REQUESTS_PER_WINDOW) return response.status(429).json({ error: "Voice request limit reached. Try again shortly." });
    recent.push(now);
    speechRequests.set(clientId, recent);

    const text = String(request.body?.text || "").trim().slice(0, MAX_SPEECH_CHARACTERS);
    if (!text) return response.status(400).json({ error: "Speech text is required." });
    const azureConfigured = Boolean(process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION);
    const elevenLabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
    if (!azureConfigured && !elevenLabsConfigured) return response.status(503).json({ error: "No neural voice provider is configured." });

    let result;
    try {
      result = await azureSpeech(text);
    } catch {}
    if (!result) {
      try {
        result = await elevenLabsSpeech(text);
      } catch {}
    }
    if (!result) return response.status(502).json({ error: "Configured neural voice providers could not generate speech." });
    response.set({
      "Content-Type": result.contentType,
      "Cache-Control": "no-store",
      "X-Voice-Provider": result.provider,
      "X-Voice-Model": result.model
    });
    return response.send(result.audio);
  });
}
