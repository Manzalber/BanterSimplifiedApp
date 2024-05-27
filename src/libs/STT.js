'use server';

import { createClient } from "@deepgram/sdk";
import { Readable } from "stream";

export default async function STT(base64Audio) {
  try {
    // Extract the audio data from the base64 string
    const audioData = Buffer.from(base64Audio.split(',')[1], 'base64');
    // Create a ReadableStream from the audio data Buffer
    const audioStream = Readable.from(audioData);
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    // Transcribe the audio stream
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioStream,
      {
        model: "nova-2",
      })

    if (error) {
      throw new Error(error);
    }

    console.log({result: result.results.channels[0]})

    const transcript = result.results?.channels[0]?.alternatives[0]?.transcript;
    console.log({transcript})
    if (transcript) {
      return transcript;
    } else {
      return "Silence"
    }
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
}