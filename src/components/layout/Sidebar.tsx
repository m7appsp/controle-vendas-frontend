import { Home, BarChart3, Settings } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <aside className="w-24 h-full bg-white/20 backdrop-blur-xl flex flex-col items-center py-6 gap-6 text-white">

      {/* Logo */}
      <div className="w-12 h-12 bg-white/30 rounded-full" />

      {/* Botão Dashboard */}
      <button
        onClick={() => setActive("dashboard")}
        className={`p-3 rounded-xl ${
          active === "dashboard" ? "bg-white/30" : "hover:bg-white/20"
        }`}
      >
        <Home size={22} />
      </button>

      {/* Botão Gráficos */}
      <button
        onClick={() => setActive("analytics")}
        className={`p-3 rounded-xl ${
          active === "analytics" ? "bg-white/30" : "hover:bg-white/20"
        }`}
      >
        <BarChart3 size={22} />
      </button>

      {/* Botão Config */}
      <button
        onClick={() => setActive("settings")}
        className={`p-3 rounded-xl ${
          active === "settings" ? "bg-white/30" : "hover:bg-white/20"
        }`}
      >
        <Settings size={22} />
      </button>

    </aside>
  );
}