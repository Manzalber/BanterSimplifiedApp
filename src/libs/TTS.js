'use server'; // This is a server component

import { ElevenLabsClient } from "elevenlabs";
const { createWriteStream } = require("fs");
const { v4: uuidv4 } = require("uuid");

// Initialize the ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export default async function TTS(ChatOutput) {
  // Generate audio from text using ElevenLabs
  const audio = await client.generate({
    voice: "Adam",
    model_id: "eleven_turbo_v2",
    text: ChatOutput,
  });
    // Read the audio stream into a Buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Convert the Buffer to a base64 encoded string
    const base64Audio = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
    return base64Audio;
}