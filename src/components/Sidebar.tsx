import {
  Home,
  ClipboardCheck,
  Settings,
  Plus,
  List,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      to: "/",
      icon: Home,
      label: "Dashboard",
    },
    {
      to: "/instalacoes",
      icon: ClipboardCheck,
      label: "Instalações",
    },
    {
      to: "/nova-venda",
      icon: Plus,
      label: "Nova Venda",
    },
    {
      to: "/vendas",
      icon: List,
      label: "Lista de Vendas",
    },
    {
      to: "/configuracoes",
      icon: Settings,
      label: "Configurações",
    },
  ];

  return (
    <div
      className="
        group h-screen flex flex-col py-6 gap-6
        bg-[#020617]/60 backdrop-blur-xl
        border-r border-white/10
        w-20 hover:w-56
        transition-all duration-300 ease-in-out
        overflow-hidden
        shadow-[5px_0_30px_rgba(0,0,0,0.5)]
        z-50 shrink-0
      "
    >
      {/* ======================
          TOPO PREMIUM (VIDRO + COBALT)
      ====================== */}
      <div className="px-3 transition-all duration-300">
        <div
          className="
            bg-gradient-to-b from-blue-600/10 to-transparent
            border border-white/10
            backdrop-blur-md
            rounded-2xl
            text-center
            shadow-lg
            h-[220px]
            flex flex-col justify-center items-center
            px-2 relative overflow-hidden
          "
        >
          {/* Brilho de fundo sutil no card do usuário */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />

          {/* LOJA */}
          <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Loja Barueri
          </p>

          {/* AVATAR */}
          <div
            className="
              w-12 h-12 rounded-full
              my-3
              flex items-center justify-center
              bg-gradient-to-br from-blue-600 to-cyan-500
              text-white font-bold text-base
              shadow-lg shadow-blue-500/20
              shrink-0
            "
          >
            MF
          </div>

          {/* NOME */}
          <p className="text-xs font-bold text-slate-200 leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
            Marcelo Fernandes
          </p>

          {/* MÊS */}
          <div
            className="
              mt-3 text-[11px] font-medium
              bg-blue-500/10
              border border-blue-500/20
              rounded-full py-1 px-3
              text-blue-300
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              whitespace-nowrap
            "
          >
            Maio 2026
          </div>
        </div>
      </div>

      {/* ======================
          MENU COM SELEÇÃO NEON
      ====================== */}
      <nav className="flex flex-col gap-2 mt-2 px-2">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <div
              key={index}
              className="relative group/item flex justify-center w-full"
            >
              <NavLink
                to={item.to}
                className={`
                  relative flex items-center w-full
                  px-2.5 py-2.5 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/15 to-transparent text-blue-400 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }
                `}
              >
                {/* GLOW ATIVO E BORDA LATERAL GLOW */}
                {isActive && (
                  <>
                    <span className="absolute inset-0 rounded-xl bg-blue-500/5 blur-sm" />
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
                  </>
                )}

                {/* CONTAINER DO ÍCONE */}
                <div
                  className={`
                    flex items-center justify-center
                    w-10 h-10 rounded-xl
                    border shrink-0
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-md shadow-blue-500/5"
                        : "bg-white/5 border-white/5 text-slate-400 group-hover/item:text-white group-hover/item:border-white/10 group-hover/item:bg-white/10"
                    }
                  `}
                >
                  <Icon size={18} />
                </div>

                {/* TEXTO EXPANSÍVEL */}
                <span
                  className="
                    ml-3 text-sm whitespace-nowrap font-medium
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300 ease-in-out
                  "
                >
                  {item.label}
                </span>
              </NavLink>

              {/* TOOLTIP (APARECE SÓ QUANDO A SIDEBAR ESTÁ FECHADA) */}
              <div
                className="
                  absolute left-full ml-4 top-1/2 -translate-y-1/2
                  px-3 py-1.5 rounded-xl text-white text-xs font-medium
                  bg-[#0b1220]/90 backdrop-blur-md border border-white/10
                  shadow-xl
                  opacity-0 pointer-events-none
                  group-hover/item:opacity-100
                  group-hover:group-hover/item:opacity-0
                  translate-x-[-10px] group-hover/item:translate-x-0
                  transition-all duration-200
                  whitespace-nowrap
                  z-50
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