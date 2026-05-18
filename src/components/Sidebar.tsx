import { Home, BarChart3, Settings, Plus, List } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/relatorios", icon: BarChart3, label: "Relatórios" },
    { to: "/nova-venda", icon: Plus, label: "Nova Venda" },
    { to: "/vendas", icon: List, label: "Lista de Vendas" },
    { to: "/configuracoes", icon: Settings, label: "Configurações" },
  ];

  return (
    <div
      className="
        group h-full flex flex-col py-6 gap-6
        bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#0b1220]
        border-r border-white/10
        backdrop-blur-2xl
        w-20 hover:w-56
        transition-all duration-300 ease-in-out
        overflow-hidden
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
      "
    >
      {/* ======================
         TOPO PREMIUM
      ====================== */}
      <div className="px-3">
        <div
          className="
            bg-gradient-to-b from-[#0ea5e9]/20 to-[#0284c7]/20
            border border-white/10
            backdrop-blur-xl
            rounded-2xl
            text-center
            shadow-lg
            h-[250px]
            flex flex-col justify-center
            px-4
          "
        >
          {/* LOJA */}
          <p className="text-xs text-slate-300">
            Loja Barueri
          </p>

          {/* AVATAR */}
          <div
            className="
              w-12 h-12 rounded-full
              mx-auto my-4
              flex items-center justify-center
              bg-gradient-to-br from-cyan-400 to-blue-500
              text-white font-bold
              shadow-md
            "
          >
            MF
          </div>

          {/* NOME */}
          <p className="text-xs font-semibold text-white leading-tight">
            Marcelo Fernandes
          </p>

          {/* MÊS */}
          <div
            className="
              mt-4 text-xs
              bg-white/10
              border border-white/10
              rounded-lg py-2 px-2
              text-slate-200
            "
          >
            Maio 2026
          </div>
        </div>
      </div>

      {/* ======================
         MENU
      ====================== */}
      <nav className="flex flex-col gap-3 mt-4 px-2">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <div
              key={index}
              className="relative group/item flex justify-center"
            >
              <NavLink
                to={item.to}
                className={`
                  relative flex items-center w-full
                  px-3 py-3 rounded-xl
                  transition-all duration-300
                  ${isActive ? "bg-white/10" : "hover:bg-white/5"}
                `}
              >
                {/* GLOW ATIVO */}
                {isActive && (
                  <>
                    <span className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-md" />
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  </>
                )}

                {/* ÍCONE */}
                <div
                  className="
                    flex items-center justify-center
                    w-10 h-10 rounded-lg
                    bg-white/5 border border-white/10
                    shadow-sm
                    shrink-0
                    transition-transform duration-200
                    group-hover:scale-110
                  "
                >
                  <Icon size={20} className="text-white" />
                </div>

                {/* TEXTO */}
                <span
                  className="
                    ml-3 text-white text-sm whitespace-nowrap
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200
                  "
                >
                  {item.label}
                </span>
              </NavLink>

              {/* TOOLTIP */}
              <div
                className="
                  absolute left-full ml-3 top-1/2 -translate-y-1/2
                  px-3 py-2 rounded-lg text-white text-sm
                  bg-white/10 backdrop-blur-xl border border-white/20
                  shadow-lg
                  opacity-0 group-hover/item:opacity-100
                  translate-x-[-8px] group-hover/item:translate-x-0
                  transition-all duration-200
                  whitespace-nowrap
                "
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}