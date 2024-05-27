## Banter Interview Exercise (2 Days)

Make a Simplified version of a Banter's feature by simulating a phone call with Steve jobs. Deploy a WebApp using ChatGPT to generate a Conversation with Steve Jobs. Using 11labs to do the Text to Speech from HuggingFaces and DeepGram to Transcribe the audio to Text. Use NextJs as stack.

## Project Structure
Steve Jobs AI Conversation Simulator using Next.js with the App Router approach with a seed template. Using ESlint as formatter and multiple AI models to convert audio back and forth and generate the conversation.

### Tech Stack
- Next.js: Framework for building React-based web applications.
- Tailwind CSS: Utility-first CSS framework for rapid UI development.
- Gemini API: (Placeholder) AI model for generating conversation responses (replace with your actual implementation- ElevenLabs API: Text-to-speech API for generating realistic voice output.
- Deepgram API: Speech-to-text API for transcribing user audio input.

### Project Structure
```
my-steve-jobs-call/
├── app/               # Main application directory (Next.js App Router)
│   ├── page.jsx       # Main page component
│   ├── layout.jsx     # Optional layout component
├── components/         # Reusable React components
│   └── PhoneCall.jsx  # Main component for call functionality
├── libs/               # Server components for API interactions
│   ├── Chat.jsx       # Handles conversation with Gemini API
│   ├── TTS.jsx        # Converts text to speech with ElevenLabs API
│   ├── STT.jsx        # Transcribes speech to text with Deepgram API
└── .env.local         # Environment variables for API keys (not tracked in version control)
```
### Setup
Clone the repository: `git clone <repository-url>`

Install dependencies: `npm install`

Create .env.local file: Add your API keys for ElevenLabs and Deepgram in this file (see example below).

Start the development server: `npm run dev`

Example .env.local:
```
ELEVENLABS_API_KEY=XXX
DEEPGRAM_API_KEY=XXX
GEMINI_API_KEY=XXX
```

### Future Enhancements
- Conversation History: Store and display a longer conversation history.
- Voice Customization: Allow users to choose different voices for Steve Jobs.
- Improved UI: Add more visual elements and interactions to enhance the user experience.
- Improve the Audio media handler: Right now the microphone does not stop being available to the app once it has finished the 5 sec recording. This is because of how Web browsers handle media devices and can be improved.
- Improve simulation of Steve Jobs: Improve the prompt for the Steve Jobs simulation in Gemini by fine tunning the context, as well as avoid to bypass the initial prompt every time and just the initial chat.