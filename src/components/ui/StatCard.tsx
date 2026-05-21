import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variacao?: number;
  meta?: number;
  realizado?: number;
}

export default function StatCard({
  title,
  value,
  icon,
  variacao = 0,
  meta = 0,
  realizado = 0,
}: StatCardProps) {
  const positivo = variacao >= 0;
  const faltam = meta - realizado;
  const progresso = meta === 0 ? 0 : Math.min((realizado / meta) * 100, 100);

  return (
    <div 
      className="
        relative
        rounded-3xl
        bg-gradient-to-b from-[#0b1329]/80 to-[#040814]/90
        backdrop-blur-xl
        border border-white/10
        p-6
        h-[320px]
        flex flex-col
        justify-between
        overflow-hidden
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300 ease-in-out
        hover:border-blue-500/30 hover:shadow-blue-500/5 hover:-translate-y-0.5
        group
      "
    >
      {/* GLOW DE FUNDO CUSTOMIZADO (Efeito das imagens de referência) */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* HEADER */}
      <div className="flex justify-between items-center relative z-10">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
          {title}
        </span>

        <div className="bg-white/5 p-2.5 rounded-xl text-blue-400 border border-white/5 group-hover:text-cyan-400 group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all duration-300">
          {icon}
        </div>
      </div>

      {/* VALOR PRINCIPAL */}
      <div className="mt-2 relative z-10">
        <h3 className="text-3xl font-black tracking-tight text-white font-sans">
          {value}
        </h3>
      </div>

      {/* PROGRESSO COM BARRA TRICOLOR NEON */}
      <div className="mt-4 space-y-2 relative z-10">
        <div className="flex justify-between text-[11px] font-bold tracking-wide uppercase text-slate-400">
          <span>Progresso</span>
          <span className="text-blue-400">{progresso.toFixed(0)}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* META / REALIZADO / FALTAM (GLASS BOXES) */}
      <div className="grid grid-cols-3 gap-2 text-xs mt-4 relative z-10">
        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-2.5 text-center">
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">Meta</p>
          <p className="font-bold text-slate-300">{meta}</p>
        </div>

        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-2.5 text-center">
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">Realizado</p>
          <p className="font-bold text-blue-400">{realizado}</p>
        </div>

        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-2.5 text-center">
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">Faltam</p>
          <p className="font-bold text-rose-400/90">
            {faltam > 0 ? faltam : 0}
          </p>
        </div>
      </div>

      {/* VARIAÇÃO — SEMPRE VISÍVEL */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs relative z-10">
        <div
          className={`flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 ${
            positivo ? "text-emerald-400 border-emerald-500/10" : "text-rose-400 border-rose-500/10"
          }`}
        >
          {positivo ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {positivo ? "+" : ""}
          {variacao}%
        </div>

        <span className="text-slate-500 text-[11px] font-medium whitespace-nowrap">
          vs mês anterior
        </span>
      </div>

    </div>
  );
}