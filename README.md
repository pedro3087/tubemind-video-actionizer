# TubeMind - Video Actionizer

**Repository Name:** `tubemind-video-actionizer`

## Description

TubeMind is a productivity-focused web application designed to transform passive video consumption into active implementation. By leveraging the power of Google's **Gemini 2.5 Flash** model, TubeMind analyzes YouTube videos to extract concise summaries, key highlights, and—most importantly—concrete action items.

Users can organize these insights using a flexible tagging system and track their progress by checking off action items as they are completed.

## Features

- **AI-Powered Analysis**: Instantly generates summaries, highlights, and action plans from YouTube video URLs.
- **Action Item Tracking**: Interactive checklists allow you to track your implementation progress for every video.
- **Tagging System**: Organize insights with custom tags (e.g., `#coding`, `#fitness`, `#finance`) for better retrieval.
- **Search & Filter**: Quickly find past insights by searching titles or filtering by specific tags.
- **Local Privacy**: All data is stored securely in your browser's `localStorage`.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Model**: `gemini-2.5-flash`

## Usage

1. **Analyze**: Click the "New Analysis" button and paste a YouTube URL.
   - *Optional*: Paste a transcript or context notes for higher accuracy.
2. **Review & Tag**: The AI will generate a summary and action items. Add relevant tags to organize the note.
3. **Save**: Save the insight to your personal library.
4. **Implement**: Open the saved insight from the library and check off action items as you complete them.

## Setup

To run this application:

1. Ensure you have a valid API Key from [Google AI Studio](https://aistudio.google.com/).
2. The application is configured to read the API key from `process.env.API_KEY`.

## Roadmap & Future Improvements

We are actively working on scaling TubeMind from a local browser tool to a robust cloud application. The following features are planned:

1. **Database Integration (Firebase)**
   - Migrate data storage from `localStorage` to **Firebase Firestore**.
   - This will ensure data persistence and allow you to access your insights across multiple devices (desktop, mobile, tablet).

2. **User Authentication & Management**
   - Implement **Firebase Authentication** to support secure user accounts.
   - Enable multi-user support so everyone maintains their own private library of video insights.
   - Add user profiles for personalized settings and default tags.

3. **Cloud Deployment**
   - Deploy the application to a reliable cloud hosting provider (e.g., **Vercel**, **Netlify**, or **Firebase Hosting**).
   - Establish a production URL for public access.
   - Implement CI/CD pipelines for seamless updates.

## License

MIT