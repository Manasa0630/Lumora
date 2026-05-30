import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-orange-100 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
     <div
  className="flex items-center gap-2 cursor-pointer"
  onClick={() => navigate("/dashboard")}
>
  <span
    style={{
      fontSize: "28px",
      fontWeight: "900",
      color: "#9333EA",
      display: "block",
    }}
  >
    Lumora
  </span>
</div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-xs font-semibold text-purple-600">
          {user?.displayName?.charAt(0)}
        </div>
        <span className="text-sm text-gray-500">{user?.displayName}</span>
        <button
          onClick={async () => { await logout(); navigate("/"); }}
          className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}