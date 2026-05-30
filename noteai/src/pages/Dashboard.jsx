import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const q = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Delete this note?")) return;
    await deleteDoc(doc(db, "notes", id));
    setNotes(notes.filter((n) => n.id !== id));
  };

  const avgScore = () => {
    const scored = notes.filter((n) => n.quizScore !== undefined);
    if (!scored.length) return "—";
    return Math.round(scored.reduce((a, b) => a + b.quizScore, 0) / scored.length) + "%";
  };

  const stats = [
    { label: "Notes Uploaded", value: notes.length, sub: "Total", icon: "ti-file-text", gradient: "from-violet-500 to-purple-600" },
    { label: "Quizzes Taken", value: notes.filter(n => n.quizScore !== undefined).length, sub: "Completed", icon: "ti-brain", gradient: "from-blue-500 to-indigo-600" },
    { label: "Flashcard Sets", value: notes.filter(n => n.flashcards?.length > 0).length, sub: "Generated", icon: "ti-cards", gradient: "from-pink-500 to-rose-500" },
    { label: "Avg Quiz Score", value: avgScore(), sub: "Overall", icon: "ti-chart-bar", gradient: "from-amber-400 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50" >
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
            Welcome back, {user?.displayName?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-base">
            Upload your notes and let AI do the heavy lifting.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: "#ffffff", border: "1px solid #fde8d8" }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4`}>
                <i className={`ti ${s.icon} text-white text-xl`} />
              </div>
              <div className="text-4xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-base font-semibold text-gray-800 mb-0.5">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Upload Banner */}
        <div
          onClick={() => navigate("/upload")}
          className="rounded-2xl p-7 flex items-center justify-between mb-6 cursor-pointer transition"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
            border: "1px solid #6d28d9"
          }}
        >
          <div>
            <div className="text-white font-black text-xl mb-1">Upload new notes</div>
            <div className="text-purple-200 text-sm">PDF or paste text → instant summary, MCQs & flashcards</div>
          </div>
          <button className="bg-white text-purple-700 font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-purple-50 transition">
            <i className="ti ti-plus text-base" /> Upload
          </button>
        </div>

        {/* Progress Chart */}
        {notes.filter(n => n.quizScore !== undefined).length > 0 && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#ffffff", border: "1px solid #fde8d8" }}
          >
            <div className="text-gray-900 font-bold text-lg mb-5">Quiz Progress</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={[...notes]
                  .filter(n => n.quizScore !== undefined)
                  .reverse()
                  .map((n) => ({
                    name: n.title.slice(0, 12),
                    score: n.quizScore,
                  }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Score"]}
                  contentStyle={{ fontSize: 13, borderRadius: 10, background: "#fff", border: "1px solid #fde8d8", color: "#111" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ fill: "#7c3aed", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "#a78bfa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Notes Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-900 font-bold text-lg">Your Notes</span>
          <span className="text-sm text-gray-400">{notes.length} notes</span>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : notes.length === 0 ? (
          <div
            className="rounded-2xl py-24 text-center bg-white"
            style={{ border: "2px dashed #fde8d8" }}
          >
            <div className="text-5xl mb-4">📭</div>
            <div className="font-bold text-gray-800 text-lg mb-2">No notes yet</div>
            <div className="text-sm text-gray-400 mb-6">Upload your first PDF to get started</div>
            <button
              onClick={() => navigate("/upload")}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition cursor-pointer"
            >
              Upload notes →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => navigate(`/note/${note.id}`)}
                className="rounded-2xl p-5 cursor-pointer transition hover:scale-[1.02] bg-white"
                style={{ border: "1px solid #fde8d8" }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    <i className="ti ti-file-text text-white text-lg" />
                  </div>
                  {note.quizScore !== undefined && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "#f3f0ff", color: "#7c3aed" }}>
                      {note.quizScore}%
                    </span>
                  )}
                </div>

                {/* Title & Date */}
                <div className="text-gray-900 font-bold text-base mb-1 truncate">{note.title}</div>
                <div className="text-gray-400 text-xs mb-4">
                  {note.createdAt?.toDate().toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </div>

                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {note.mcqs?.length > 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "#ede9fe", color: "#6d28d9" }}>
                      {note.mcqs.length} MCQs
                    </span>
                  )}
                  {note.flashcards?.length > 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "#fce7f3", color: "#be185d" }}>
                      {note.flashcards.length} Cards
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 border-t pt-3" style={{ borderColor: "#fde8d8" }}>
                  <i className="ti ti-eye text-gray-400 hover:text-purple-500 cursor-pointer transition text-base" title="View" />
                  <i className="ti ti-brain text-gray-400 hover:text-blue-500 cursor-pointer transition text-base" title="Quiz" />
                  <i className="ti ti-cards text-gray-400 hover:text-pink-500 cursor-pointer transition text-base" title="Flashcards" />
                  <i
                    onClick={(e) => deleteNote(e, note.id)}
                    className="ti ti-trash text-gray-400 hover:text-red-500 cursor-pointer transition text-base ml-auto"
                    title="Delete"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}