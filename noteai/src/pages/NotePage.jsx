import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("summary"); // summary | quiz | flashcards
  
  // Quiz state
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { fetchNote(); }, []);

  const fetchNote = async () => {
    try {
      const snap = await getDoc(doc(db, "notes", id));
      if (snap.exists()) setNote({ id: snap.id, ...snap.data() });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Quiz logic
  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    const correct = option[0] === note.mcqs[current].answer;
    setAnswers([...answers, { correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= note.mcqs.length) {
      const score = Math.round((answers.filter(a => a.correct).length / note.mcqs.length) * 100);
      updateDoc(doc(db, "notes", id), { quizScore: score });
      setNote({ ...note, quizScore: score });
      setQuizDone(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setQuizDone(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96 text-gray-400 text-sm">Loading...</div>
    </div>
  );

  if (!note) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96 text-gray-400 text-sm">Note not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6 cursor-pointer"
        >
          <i className="ti ti-arrow-left text-sm" /> Back to dashboard
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{note.title}</h1>
            <p className="text-xs text-gray-400">
              {note.createdAt?.toDate().toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
          {note.quizScore !== undefined && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold text-purple-600">{note.quizScore}%</div>
              <div className="text-xs text-purple-400">Quiz Score</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["summary", "quiz", "flashcards"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition capitalize ${
                tab === t
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t === "summary"}
              {t === "quiz" }
              {t === "flashcards"}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* SUMMARY TAB */}
        {tab === "summary" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-sm mb-4 text-gray-700">Key Points</h2>
            <ul className="space-y-3">
              {note.summary?.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* QUIZ TAB */}
        {tab === "quiz" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            {quizDone ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">
                  {note.quizScore >= 80 ? "🎉" : note.quizScore >= 50 ? "👍" : "📚"}
                </div>
                <div className="text-2xl font-bold mb-1">{note.quizScore}%</div>
                <div className="text-sm text-gray-400 mb-6">
                  {answers.filter(a => a.correct).length} out of {note.mcqs.length} correct
                </div>
                <button
                  onClick={resetQuiz}
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition cursor-pointer"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <div>
                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400">
                    Question {current + 1} of {note.mcqs.length}
                  </span>
                  <div className="flex gap-1">
                    {note.mcqs.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-8 rounded-full ${
                          i < current ? "bg-purple-600" :
                          i === current ? "bg-purple-300" : "bg-gray-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <h2 className="font-semibold text-gray-800 mb-5 leading-relaxed">
                  {note.mcqs[current].question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {note.mcqs[current].options.map((option, i) => {
                    const isCorrect = option[0] === note.mcqs[current].answer;
                    const isSelected = selected === option;
                    let style = "border-gray-200 hover:border-purple-300 hover:bg-purple-50";
                    if (selected) {
                      if (isCorrect) style = "border-green-400 bg-green-50";
                      else if (isSelected) style = "border-red-400 bg-red-50";
                      else style = "border-gray-100 opacity-50";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition cursor-pointer ${style}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Next */}
                {selected && (
                  <button
                    onClick={handleNext}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition cursor-pointer"
                  >
                    {current + 1 >= note.mcqs.length ? "See Results →" : "Next Question →"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {tab === "flashcards" && (
          <div>
            {/* Card */}
            <div
              onClick={() => setFlipped(!flipped)}
              className="bg-white border border-gray-100 rounded-2xl p-10 text-center cursor-pointer hover:shadow-md transition mb-4 min-h-48 flex flex-col items-center justify-center"
            >
              <div className="text-xs text-gray-300 mb-4 uppercase tracking-widest">
                {flipped ? "Answer" : "Question"}
              </div>
              <div className="text-gray-800 font-medium leading-relaxed">
                {flipped
                  ? note.flashcards[cardIndex].answer
                  : note.flashcards[cardIndex].question}
              </div>
              <div className="text-xs text-gray-300 mt-6">Click to flip</div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setCardIndex(Math.max(0, cardIndex - 1)); setFlipped(false); }}
                disabled={cardIndex === 0}
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition cursor-pointer"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-400">
                {cardIndex + 1} / {note.flashcards.length}
              </span>
              <button
                onClick={() => { setCardIndex(Math.min(note.flashcards.length - 1, cardIndex + 1)); setFlipped(false); }}
                disabled={cardIndex === note.flashcards.length - 1}
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition cursor-pointer"
              >
                Next →
              </button>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {note.flashcards.map((_, i) => (
                <div
                  key={i}
                  onClick={() => { setCardIndex(i); setFlipped(false); }}
                  className={`w-2 h-2 rounded-full cursor-pointer transition ${
                    i === cardIndex ? "bg-purple-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}