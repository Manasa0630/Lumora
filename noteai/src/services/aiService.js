const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PROMPT = (text) => `
You are a study assistant. Given the following notes, generate:
1. A concise summary (5-8 bullet points)
2. 5 multiple choice questions (MCQs) with 4 options each and the correct answer
3. 8 flashcards (question and answer pairs)

Return ONLY a valid JSON object in this exact format, no extra text, no markdown:
{
  "summary": ["point 1", "point 2", ...],
  "mcqs": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A"
    }
  ],
  "flashcards": [
    { "question": "...", "answer": "..." }
  ]
}

Notes:
${text.slice(0, 4000)}
`;

export async function generateFromNotes(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT(text) }] }],
      }),
    }
  );

  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  const raw = data.candidates[0].content.parts[0].text;
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}