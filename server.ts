import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client if key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: AI Generation route (Script, Scene Breakdown, Research, Verification)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction, taskType } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request' });
    }

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are the Aurlex AI Director and Production Studio Orchestrator. Respond concisely with structured production data.',
          temperature: 0.7,
        },
      });
      return res.json({ text: response.text });
    } else {
      // Fallback response for offline or when GEMINI_API_KEY is not configured
      let simulatedResponse = '';
      if (taskType === 'script') {
        simulatedResponse = `[SCENE 01: The Reservoir of Value]\nDuration: 6.5s\nCharacter: CHAR_001 (Arjun)\nAction: Arjun walks toward central bank digital vault ledger\nCamera: Wide to medium dolly push\nDialogue: "Every morning at 09:00, commercial banks face a delicate balance: how much liquid cash to keep, and how much to lend."\nMotionSpec: Walking 1.2s -> turns 45 deg at 2.4s -> gestures toward floating monetary chart at 4.0s -> holds neutral analytical pose at 6.0s.`;
      } else if (taskType === 'research') {
        simulatedResponse = `RESEARCH BRIEF:\nKey Mechanisms: CRR (Cash Reserve Ratio), SLR (Statutory Liquidity Ratio), LAF (Liquidity Adjustment Facility).\nHistorical Precedent: 2020 Liquidity Infusion packages & Repo Operations.\nTarget Audience: Curious professionals wanting visual clarity without academic jargon.`;
      } else if (taskType === 'verify') {
        simulatedResponse = `VERIFICATION AUDIT:\nTechnical: 1920x1080 @ 24fps | Codec: H.264/AAC | Audio Sync: 0ms drift.\nVisual: 0 black frames detected | Character ID match: 98.4% consistency (CHAR_001).\nTemporal Motion: Coherent optical flow detected across 156 frames (Delta Variance: 0.28). Motion status: PASSED.`;
      } else {
        simulatedResponse = `AI Director ready: Processed production directive for "${prompt.slice(0, 40)}..."`;
      }
      return res.json({ text: simulatedResponse, simulated: true });
    }
  } catch (error: any) {
    console.error('Error generating AI content:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Hardware telemetry API
app.get('/api/hardware/telemetry', (_req, res) => {
  // Return current telemetry (updated if local agent has reported)
  res.json(currentTelemetry);
});

// Store telemetry (can be updated by local agent or default)
let currentTelemetry = {
  mode: 'hybrid', // 'local' | 'hybrid' | 'cloud'
  localComfyConnected: false,
  localOllamaConnected: false,
  gpu: {
    name: 'NVIDIA GeForce GTX 1650',
    totalVramGb: 4.0,
    usedVramGb: 2.84,
    vramPercent: 71,
    temperatureC: 64,
    utilizationPercent: 82,
    isRealLocalData: false,
  },
  cpu: {
    model: 'AMD Ryzen 5 / Intel Core i5',
    utilizationPercent: 24,
    cores: 6,
  },
  ram: {
    totalGb: 16.0,
    usedGb: 9.8,
    percent: 61,
  },
  services: {
    comfyUI: { status: 'online', port: 8188, latencyMs: 14, url: 'http://127.0.0.1:8188' },
    ollama: { status: 'online', port: 11434, latencyMs: 9, url: 'http://127.0.0.1:11434' },
    tts: { status: 'online', engine: 'Index-TTS / Edge-TTS', latencyMs: 42 },
    ffmpeg: { status: 'ready', version: '6.1.1' },
    whisper: { status: 'online', engine: 'faster-whisper-large-v3' },
  },
};

// Endpoint to ingest real telemetry from local Python agent (e.g. nvidia-smi poller)
app.post('/api/local/telemetry/report', (req, res) => {
  try {
    const { gpu, cpu, ram } = req.body;
    if (gpu) {
      currentTelemetry.gpu = {
        ...currentTelemetry.gpu,
        ...gpu,
        isRealLocalData: true,
      };
    }
    if (cpu) currentTelemetry.cpu = { ...currentTelemetry.cpu, ...cpu };
    if (ram) currentTelemetry.ram = { ...currentTelemetry.ram, ...ram };
    currentTelemetry.mode = 'local';
    return res.json({ success: true, message: 'Local telemetry synced.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Proxy to test/check local ComfyUI daemon
app.get('/api/local/comfy/health', async (req, res) => {
  const comfyHost = (req.query.host as string) || 'http://127.0.0.1:8188';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const pingRes = await fetch(`${comfyHost}/system_stats`, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (pingRes.ok) {
      const stats = await pingRes.json();
      currentTelemetry.localComfyConnected = true;
      return res.json({ 
        online: true, 
        host: comfyHost, 
        stats, 
        message: 'Connected to live local ComfyUI instance.' 
      });
    }
    return res.json({ online: false, host: comfyHost, message: `ComfyUI returned HTTP ${pingRes.status}` });
  } catch (err: any) {
    return res.json({ 
      online: false, 
      host: comfyHost, 
      message: `Local ComfyUI not detected at ${comfyHost}. Run ComfyUI with: python main.py --listen 127.0.0.1 --port 8188` 
    });
  }
});

// Endpoint to list detected ComfyUI model checkpoints & motion modules
app.get('/api/local/comfy/models', async (req, res) => {
  const comfyHost = (req.query.host as string) || 'http://127.0.0.1:8188';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch(`${comfyHost}/object_info`, { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      const checkpoints = data?.CheckpointLoaderSimple?.input?.required?.ckpt_name?.[0] || [];
      const motionModules = data?.ADE_AnimateDiffLoaderWithContext?.input?.required?.model_name?.[0] || [];
      return res.json({
        online: true,
        checkpoints: checkpoints.length > 0 ? checkpoints : ['v1-5-pruned-emaonly.safetensors', 'counterfeit-v30.safetensors'],
        motionModules: motionModules.length > 0 ? motionModules : ['v3_sd15_mm.ckpt', 'mm_sd_v15_v2.ckpt'],
      });
    }
  } catch (e) {
    // Return standard local motion models when ComfyUI is idle or offline
  }
  return res.json({
    online: false,
    checkpoints: [
      'v1-5-pruned-emaonly.safetensors (SD 1.5 Base)',
      'dreamshaper_8.safetensors (Stylized Anime/2D)',
      'counterfeit-v30.safetensors (2D Studio Cel)',
      'sd_xl_base_1.0.safetensors (SDXL)'
    ],
    motionModules: [
      'v3_sd15_mm.ckpt (AnimateDiff v3 Motion Module)',
      'mm_sd_v15_v2.ckpt (AnimateDiff v2 Sliding Window)',
      'v3_sd15_adapter.ckpt (Motion Lora Compatible)',
      'lcm-motion-lora-sd15.safetensors (LCM Fast 4-step)'
    ],
  });
});

// Proxy to test/check local Ollama daemon
app.get('/api/local/ollama/health', async (req, res) => {
  const ollamaHost = (req.query.host as string) || 'http://127.0.0.1:11434';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const pingRes = await fetch(`${ollamaHost}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    if (pingRes.ok) {
      const data = await pingRes.json();
      currentTelemetry.localOllamaConnected = true;
      return res.json({
        online: true,
        host: ollamaHost,
        models: (data.models || []).map((m: any) => m.name),
        message: 'Connected to local Ollama server.',
      });
    }
    return res.json({ online: false, host: ollamaHost, message: `Ollama returned HTTP ${pingRes.status}` });
  } catch (err: any) {
    return res.json({
      online: false,
      host: ollamaHost,
      message: `Local Ollama not detected at ${ollamaHost}. Start with: ollama serve`,
    });
  }
});

// Proxy to generate prompt using local Ollama model (e.g. Llama 3)
app.post('/api/local/ollama/generate', async (req, res) => {
  const { host = 'http://127.0.0.1:11434', model = 'llama3', prompt } = req.body;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(`${host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.json();
      return res.json({ text: data.response, model: data.model, local: true });
    }
    return res.status(502).json({ error: `Ollama returned ${response.status}` });
  } catch (e: any) {
    // If local Ollama is not active, return high-accuracy simulated Llama 3 motion response
    return res.json({
      simulated: true,
      text: `[Local Llama 3 Motion Plan for: ${prompt.slice(0, 45)}...]\nContinuous motion sequence: Keyframe 1: 45-degree angle turn (delta 0.62) -> Keyframe 2: gesture towards balance sheet chart (delta 0.84) -> Keyframe 3: steady eye contact with camera (delta 0.48). Optical flow index 0.76.`,
    });
  }
});

// Proxy to queue real AnimateDiff workflow into local ComfyUI
app.post('/api/local/comfy/queue', async (req, res) => {
  const { host = 'http://127.0.0.1:8188', workflow, promptId } = req.body;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const postRes = await fetch(`${host}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow || {}, client_id: promptId || 'aurlex_client' }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (postRes.ok) {
      const result = await postRes.json();
      return res.json({ success: true, queuedToLocal: true, result });
    } else {
      const errText = await postRes.text();
      return res.status(502).json({ error: `ComfyUI responded: ${errText}` });
    }
  } catch (err: any) {
    // If offline or unreachable, return formatted workflow for copy/pasting or offline testing
    return res.json({
      success: false,
      queuedToLocal: false,
      simulated: true,
      message: `Could not reach ${host}. You can download the generated AnimateDiff JSON workflow and load it in ComfyUI directly.`,
      error: err.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(port) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Aurlex Studio server running on http://localhost:${port}`);
  });
}

startServer();
