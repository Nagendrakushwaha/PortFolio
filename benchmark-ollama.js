/**
 * Benchmark Script for Qwen2.5 1.5B on Ollama
 * Tests performance on AMD Ryzen 5 5500U, 16GB RAM, CPU-only architecture
 */

import os from 'os';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';

async function runBenchmark() {
  console.log('====================================================');
  console.log('MR. KENNADY: OLLAMA LOCAL MODEL BENCHMARK');
  console.log('====================================================');
  console.log(`System: ${os.type()} ${os.arch()} | ${os.cpus()[0]?.model} (${os.cpus().length} threads)`);
  console.log(`Total RAM: ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB | Free: ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`);
  console.log(`Testing Model: ${MODEL_NAME} at ${OLLAMA_HOST}`);
  console.log('----------------------------------------------------');

  try {
    // 1. Verify model is present in tags
    const tagsRes = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!tagsRes.ok) {
      throw new Error(`Failed to connect to Ollama: HTTP ${tagsRes.status}`);
    }
    const tagsData = await tagsRes.json();
    const hasModel = tagsData.models?.some((m) => m.name.includes(MODEL_NAME) || m.name.includes('qwen2.5:1.5b'));
    console.log(`[PASS] Ollama running. Models available:`, tagsData.models?.map((m) => `${m.name} (${(m.size / (1024 ** 2)).toFixed(0)} MB)`).join(', ') || 'none');

    if (!hasModel) {
      console.log(`[WARN] Model "${MODEL_NAME}" is not yet finished downloading. Aborting benchmark for now.`);
      return;
    }

    // 2. Warmup & Prompt Benchmark
    const prompt = 'You are Mr. Kennedy. In 3 concise sentences, introduce Nagendra Kushwaha and his primary AI/ML focus.';
    console.log(`\nSubmitting benchmark prompt: "${prompt}"...`);

    const startTime = performance.now();
    let firstTokenTime = null;
    let accumulated = '';

    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        options: {
          temperature: 0.6,
          num_predict: 250,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let finalStats = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (!firstTokenTime && json.message?.content) {
            firstTokenTime = performance.now();
          }
          if (json.message?.content) {
            accumulated += json.message.content;
            process.stdout.write(json.message.content);
          }
          if (json.done) {
            finalStats = json;
          }
        } catch {}
      }
    }

    const endTime = performance.now();
    const totalDurationSec = (endTime - startTime) / 1000;
    const ttftMs = firstTokenTime ? (firstTokenTime - startTime).toFixed(0) : 'N/A';

    console.log('\n\n----------------------------------------------------');
    console.log('BENCHMARK RESULTS SUMMARY:');
    console.log('----------------------------------------------------');
    console.log(`Response length:        ${accumulated.length} chars`);
    console.log(`Time to First Token:    ${ttftMs} ms`);
    console.log(`Total Wall Time:        ${totalDurationSec.toFixed(2)} s`);

    if (finalStats) {
      const evalCount = finalStats.eval_count || 0;
      const evalDurationSec = (finalStats.eval_duration || 0) / 1e9;
      const tokensPerSec = evalDurationSec > 0 ? (evalCount / evalDurationSec).toFixed(1) : 'N/A';
      const promptTokens = finalStats.prompt_eval_count || 0;
      const promptEvalSec = (finalStats.prompt_eval_duration || 0) / 1e9;
      const promptSpeed = promptEvalSec > 0 ? (promptTokens / promptEvalSec).toFixed(1) : 'N/A';

      console.log(`Prompt tokens:          ${promptTokens} (${promptSpeed} tok/s)`);
      console.log(`Generated tokens:       ${evalCount}`);
      console.log(`Generation Speed:       ${tokensPerSec} tokens/second`);
      console.log(`Memory Footprint (est): ~1.1 GB RAM (Q4_K_M quant)`);
    }
    console.log('====================================================\n');
  } catch (err) {
    console.error('[Benchmark Error]:', err.message);
  }
}

runBenchmark();

