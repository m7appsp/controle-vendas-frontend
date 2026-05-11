import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon,
  variacao = 0,
  meta = 0,
  realizado = 0,
}: any) {
  const positivo = variacao >= 0;

  const faltam = meta - realizado;

  const progresso =
    meta === 0 ? 0 : Math.min((realizado / meta) * 100, 100);

  return (
    <div className="
      relative
      rounded-3xl
      bg-gradient-to-br from-[#0b1220] to-[#111827]
      border border-white/10
      p-6
      h-[320px]
      flex flex-col
      justify-between
      overflow-hidden
    ">

      {/* FUNDO DECORATIVO */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/10 blur-3xl rounded-full" />

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 uppercase tracking-wide">
          {title}
        </span>

        <div className="bg-white/5 p-2.5 rounded-xl text-cyan-400">
          {icon}
        </div>
      </div>

      {/* VALOR PRINCIPAL */}
      <div className="mt-4">
        <h3 className="text-3xl font-bold leading-tight">
          {value}
        </h3>
      </div>

      {/* PROGRESSO */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Progresso</span>
          <span>{progresso.toFixed(0)}%</span>
        </div>

        <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className="h-3 bg-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* META / REALIZADO / FALTAM */}
      <div className="grid grid-cols-3 gap-3 text-xs mt-7">
        <div className="bg-[#020617] rounded-lg p-3 text-center">
          <p className="text-slate-400 mb-1">Meta</p>
          <p className="font-bold">{meta}</p>
        </div>

        <div className="bg-[#020617] rounded-lg p-3 text-center">
          <p className="text-slate-400 mb-1">Realizado</p>
          <p className="font-bold">{realizado}</p>
        </div>

        <div className="bg-[#020617] rounded-lg p-3 text-center">
          <p className="text-slate-400 mb-1">Faltam</p>
          <p className="font-bold">
            {faltam > 0 ? faltam : 0}
          </p>
        </div>
      </div>

      {/* VARIAÇÃO — SEMPRE VISÍVEL */}
      <div className="mt-6 flex items-center gap-2 text-xs">

        <div
          className={`flex items-center gap-1 font-semibold ${
            positivo ? "text-green-400" : "text-red-400"
          }`}
        >
          {positivo ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {positivo ? "+" : ""}
          {variacao}%
        </div>

        <span className="text-slate-500 whitespace-nowrap">
          vs mês anterior
        </span>

      </div>

    </div>
  );
}