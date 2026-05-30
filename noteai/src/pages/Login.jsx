import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      
      {/* Mesh background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-purple-200 via-pink-100 to-transparent opacity-60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-yellow-100 to-transparent opacity-40 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white border border-gray-100 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        
        {/* Logo */}
        <div className="text-2xl font-black tracking-tight mb-2">
          Note<span className="text-purple-600">AI</span>
        </div>
        <p className="text-gray-400 text-sm mb-8">
          Turn your notes into quizzes & flashcards
        </p>

        {/* Features list */}
        <div className="text-left space-y-3 mb-8">
          {[
            "📄 Upload any PDF or paste notes",
            "✨ AI-generated summaries instantly",
            "🧠 MCQs with detailed explanations",
            "🃏 Flashcards with spaced repetition",
            "📊 Track your progress over time",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Google login button */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Free to use. No credit card required.
        </p>
      </div>
    </div>
  );
}