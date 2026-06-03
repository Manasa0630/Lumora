# Lumora ✨

Lumora is redefining how students study by turning raw notes into intelligent study material. 
Upload a PDF or paste your notes — Lumora instantly generates summaries, MCQs, and flashcards 
powered by AI, so you can focus on learning, not preparing.

## What Lumora Does

Traditional studying is slow. You read, highlight, make flashcards manually, and hope it sticks. 
Lumora eliminates that friction. By leveraging the Gemini AI API, Lumora transforms any notes 
into a complete study kit in under 10 seconds.

With AI, speed, and simplicity as our core principles — we are shaping the future of student productivity!

## Features

1. **PDF Upload & Text Extraction**
   - Upload any PDF and Lumora automatically extracts and processes the text using PDF.js

2. **AI-Powered Summarization**
   - Gemini AI reads your notes and generates clean, bullet-point summaries of key concepts

3. **MCQ Quiz Generation**
   - Automatically generates multiple choice questions with 4 options and instant right/wrong feedback

4. **Flashcard System**
   - Key concepts converted into flip cards with spaced repetition (Got it / Review Again)

5. **Progress Dashboard**
   - Track quiz scores over time with a visual line chart — see yourself improve

6. **Secure Authentication**
   - Google OAuth login via Firebase Auth — no passwords needed

7. **Cloud Storage**
   - All notes, scores, and flashcards saved to your personal account via Firestore

## Technologies Used

1. **Gemini API** — Powers AI summarization, MCQ generation, and flashcard creation
2. **Firebase** — Authentication (Google OAuth) and Firestore database
3. **React 18** — Frontend UI with component-based architecture
4. **Tailwind CSS** — Utility-first styling for a clean, responsive UI
5. **PDF.js** — Client-side PDF text extraction
6. **React Router v6** — Page navigation and protected routes
7. **Recharts** — Quiz progress visualization charts
8. **Vercel** — Deployment and hosting

## Installation Instructions

1. Clone the Lumora repository from GitHub
```bash
git clone https://github.com/Manasa0630/Lumora.git
```

2. Navigate to the project directory
```bash
cd Lumora/noteai
```

3. Install dependencies
```bash
npm install
```

4. Configure environment variables — create a `.env` file
