import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">

      {/* Mesh Background */}
      <div className="fixed top-0 right-0 w-2/3 h-screen z-0 pointer-events-none">
        <svg viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="g1" cx="70%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#c7bcfd" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#c7bcfd" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g2" cx="30%" cy="70%" r="60%">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#fca5a5" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g3" cx="80%" cy="80%" r="50%">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g4" cx="20%" cy="20%" r="40%">
              <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#fcd34d" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="800" height="900" fill="url(#g1)"/>
          <rect width="800" height="900" fill="url(#g2)"/>
          <rect width="800" height="900" fill="url(#g3)"/>
          <rect width="800" height="900" fill="url(#g4)"/>
          <ellipse cx="550" cy="250" rx="280" ry="200" fill="#a78bfa" opacity="0.18"/>
          <ellipse cx="350" cy="550" rx="220" ry="160" fill="#f87171" opacity="0.12"/>
          <ellipse cx="680" cy="650" rx="200" ry="150" fill="#34d399" opacity="0.12"/>
        </svg>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-16 py-6 border-b border-gray-100">
        <div className="text-3xl font-black tracking-tight">
          <span className="text-purple-600">Lumora</span>
        </div>
        <div className="flex items-center gap-10">
          <a href="#features" className="text-sm text-gray-500 hover:text-gray-900">Features</a>
          <a href="#how" className="text-sm text-gray-500 hover:text-gray-900">How it works</a>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            Get started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-16 pt-28 pb-20">
      
        <h1 className="text-6xl font-black tracking-tighter leading-none max-w-2xl mb-6">
          Turn any notes into<br/>
          <span className="text-purple-600">instant quizzes</span><br/>
          & <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">flashcards</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-md leading-relaxed mb-10 font-light">
          Upload any PDF or paste your notes. NoteAI summarizes, generates MCQs, builds flashcards, and tracks what you need to review — works for any subject, any topic.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 text-white px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition cursor-pointer"
          >
            Upload your notes →
          </button>
          {/* <button className="border border-gray-200 text-gray-800 px-7 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
            See a demo
          </button> */}
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-16 pt-12 border-t border-gray-100">
          {[
            { num: "10s", label: "Average generation time" },
            { num: "Any", label: "Subject or topic" },
            { num: "3x", label: "Faster revision" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black tracking-tight">{s.num}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 px-16 py-20 border-t border-gray-100">
        <div className="text-xs font-semibold tracking-widest text-purple-600 uppercase mb-3">How it works</div>
        <div className="text-3xl font-black tracking-tight mb-12">From notes to mastery in 4 steps</div>
        <div className="grid grid-cols-4 gap-6 relative">
          <div className="absolute top-5 left-5 right-5 h-px bg-gradient-to-r from-purple-600 via-purple-300 to-amber-400 z-0"/>
          {[
            { num: "1", color: "bg-purple-600", title: "Upload your notes", desc: "Drop a PDF or paste any text. We handle the rest automatically." },
            { num: "2", color: "bg-purple-400", title: "AI processes it", desc: "Claude + Gemini summarize content and extract key concepts instantly." },
            { num: "3", color: "bg-amber-400", title: "Quiz yourself", desc: "Attempt auto-generated MCQs and flip through smart flashcards." },
            { num: "4", color: "bg-red-400", title: "Track progress", desc: "Spaced repetition reminds you what to revisit. Watch scores improve." },
          ].map((s) => (
            <div key={s.num} className="relative z-10 pt-12">
              <div className={`w-10 h-10 ${s.color} text-white rounded-full flex items-center justify-center font-black text-sm mb-4`}>{s.num}</div>
              <div className="font-bold text-sm mb-2">{s.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-16 py-20 bg-gray-50 border-t border-gray-100">
        <div className="text-xs font-semibold tracking-widest text-purple-600 uppercase mb-3">Features</div>
        <div className="text-3xl font-black tracking-tight mb-10">Everything you need to revise smarter</div>
        <div className="grid grid-cols-3 gap-5">
          {[
            { icon: "📄", title: "PDF Upload", desc: "Upload any PDF or paste raw text. We extract and clean content automatically." },
            { icon: "✨", title: "AI Summarization", desc: "Get crisp, structured summaries of long chapters in seconds." },
            { icon: "🧠", title: "MCQ Generation", desc: "Auto-generate multiple-choice questions with explanations for every answer." },
            { icon: "🃏", title: "Flashcards", desc: "Key concepts as flip cards. Mark what you know and what needs more work." },
            { icon: "🔁", title: "Spaced Repetition", desc: "Smart reminders tell you exactly which cards to review today." },
            { icon: "📊", title: "Progress Dashboard", desc: "Track quiz scores and improvement over time with clean visual charts." },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-50 transition">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl mb-4">{f.icon}</div>
              <div className="font-bold text-sm mb-2">{f.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-16 py-20 bg-gray-900 text-white text-center">
        <h2 className="text-4xl font-black tracking-tight mb-4">Start studying smarter today</h2>
        <p className="text-gray-400 mb-8">No credit card needed. Upload your first PDF and see the magic.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-gray-900 px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition cursor-pointer"
        >
          Get started for free →
        </button>
      </section>

    </div>
  );
}