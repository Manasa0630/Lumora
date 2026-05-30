import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { extractTextFromPDF } from "../services/pdfService";
import { generateFromNotes } from "../services/aiService";
import Navbar from "../components/Navbar";

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("pdf");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      if (!title) setTitle(f.name.replace(".pdf", ""));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Please enter a title");
    if (mode === "pdf" && !file) return alert("Please upload a PDF");
    if (mode === "text" && !text.trim()) return alert("Please paste some notes");

    setLoading(true);
    try {
      setStep("Reading your notes...");
      const rawText = mode === "pdf" ? await extractTextFromPDF(file) : text;

      if (!rawText.trim()) {
        alert("Could not extract text from PDF. Try pasting text instead.");
        setLoading(false);
        return;
      }

      setStep("AI is generating summary, MCQs & flashcards...");
      const result = await generateFromNotes(rawText);

      setStep("Saving your notes...");
      const docRef = await addDoc(collection(db, "notes"), {
        userId: user.uid,
        title: title.trim(),
        rawText: rawText.slice(0, 5000),
        summary: result.summary,
        mcqs: result.mcqs,
        flashcards: result.flashcards,
        createdAt: serverTimestamp(),
      });

      navigate(`/note/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-10">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6 cursor-pointer"
        >
          <i className="ti ti-arrow-left text-sm" /> Back to dashboard
        </button>

        <h1 className="text-2xl font-bold tracking-tight mb-1">Upload Notes</h1>
        <p className="text-sm text-gray-400 mb-8">
          Upload a PDF or paste your notes to generate summaries, MCQs & flashcards.
        </p>

        <div className="mb-5">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Note Title</label>
          <input
            type="text"
            placeholder="e.g. Operating Systems Chapter 3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex gap-2 mb-5">
          {["pdf", "text"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
                mode === m
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {m === "pdf" ? "📄 Upload PDF" : "✏️ Paste Text"}
            </button>
          ))}
        </div>

        {mode === "pdf" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("pdf-input").click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition mb-5 ${
              drag ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
            }`}
          >
            <input
              id="pdf-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div>
                <div className="text-3xl mb-2">📄</div>
                <div className="font-medium text-sm text-gray-700">{file.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {(file.size / 1024).toFixed(0)} KB · Click to change
                </div>
              </div>
            ) : (
              <div>
                <div className="text-3xl mb-2">☁️</div>
                <div className="font-medium text-sm text-gray-700">
                  Drop your PDF here or click to browse
                </div>
                <div className="text-xs text-gray-400 mt-1">PDF files only</div>
              </div>
            )}
          </div>
        )}

        {mode === "text" && (
          <textarea
            placeholder="Paste your notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 resize-none mb-5"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
            loading
              ? "bg-purple-300 text-white cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="ti ti-loader-2 animate-spin" /> {step}
            </span>
          ) : (
            "Generate Summary, MCQs & Flashcards →"
          )}
        </button>

      </div>
    </div>
  );
}