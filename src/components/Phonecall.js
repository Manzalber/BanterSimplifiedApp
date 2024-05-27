'use client';
import { useState, useRef, useEffect } from 'react';
import Chat from '@/libs/Chat';
import TTS from '@/libs/TTS';
import STT from '@/libs/STT';

function PhoneCall() {
  const [isCalling, setIsCalling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [steveResponse, setSteveResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    // Cleanup function (essential for useEffect)
    return () => {
      clearInterval(interval); // Clear interval on unmount or when isRecording changes
      setTimeLeft(5); // Reset timeLeft when recording stops
    };
  }, [isRecording]);

  const handleCallClick = () => {
    setIsCalling(true);
    setUserInput("");
    setSteveResponse("");
    startRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setIsLoading(false);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("Stopping the record")
        setIsRecording(false);
        setIsLoading(true);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        // Convert Blob to base64 string
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);

        reader.onloadend = async () => {
          const base64AudioUser = reader.result;

          const text = await STT(base64AudioUser); // Pass the base64 string to STT
          setUserInput(text);

          const responseText = await Chat(text);
          setSteveResponse(responseText);

          const base64AudioResponse = await TTS(responseText);
          const audio = new Audio(base64AudioResponse);
          audio.play()

          setIsLoading(false);
        };
      };
      // Reset timeout on each new recording
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) { // Check if recording is still active
          stopRecording();
        }
      }, 5000); // 5-second timeout

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setTimeout(() => {
      if (mediaRecorderRef.current) {
        console.log("Forcing to stop the recording")
        mediaRecorderRef.current.stop();
      }
    }, 100);
  };

  useEffect(() => {
    if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
  }, [timeLeft, isRecording]);

  return (
    <div className="flex flex-col items-center">
      <a
        href="https://github.com/Manzalber/BanterSimplifiedApp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl font-bold text-center mb-4 hover:underline" // Add underline on hover
      >
        Banter simplified version Alberto Manzano (Click to go the repository)
      </a>      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ${isLoading || isRecording ? 'opacity-50 cursor-not-allowed' : ''
          }`} onClick={handleCallClick}
        disabled={isLoading || isRecording}
      >
        {(isLoading || isRecording) ? 'Busy...' : 'Call/Answer Steve Jobs'}
      </button>
      {isCalling && (
        <div className="bg-gray-800 text-white p-4 rounded shadow-md mt-4 w-96">
          {isRecording ? (
            <div className="text-center">
              <p>Recording for... ({timeLeft}s) Or press the Stop button</p>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                onClick={stopRecording}
              >
                Stop
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center">
              <p>Waiting for Steve Jobs to answer...</p>
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mb-4"></div>
            </div>
          ) : (
            <>
              <p className="text-blue-500 font-bold">You said:</p>
              <p>{userInput}</p>
              <p className="text-green-500 font-bold">Steve Jobs responded:</p>
              <p>{steveResponse}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PhoneCall;