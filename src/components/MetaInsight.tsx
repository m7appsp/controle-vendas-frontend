export default function MetaInsight({
  meta = 0,
  projecao = 0,
  diaria = 0,
  status = false,
}: any) {
  const progresso =
    meta === 0 ? 0 : Math.min((projecao / meta) * 100, 100);

  const faltam = Math.max(meta - projecao, 0);
  const mediaAtual = Math.floor(projecao / new Date().getDate());

  return (
    <div className="rounded-3xl bg-[#0b1220] border border-white/10 p-6 h-full">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Projeção de Meta
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Performance mensal atual
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {status ? "Meta atingível" : "Em risco"}
        </span>
      </div>

      {/* CÍRCULO PROGRESSO */}
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 rotate-[-90deg]">
            {/* fundo */}
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#1e293b"
              strokeWidth="12"
              fill="none"
            />

            {/* progresso */}
            <circle
              cx="80"
              cy="80"
              r="64"
              stroke="#06b6d4"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={402}
              strokeDashoffset={
                402 - (402 * progresso) / 100
              }
              className="transition-all duration-700"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-cyan-400">
              {progresso.toFixed(0)}%
            </p>

            <p className="text-xs text-slate-400 mt-1">
              concluído
            </p>
          </div>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#020617] rounded-2xl p-4">
          <p className="text-xs text-slate-400">Meta mensal</p>
          <p className="text-lg font-bold text-white mt-1">
            R$ {Number(meta).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-[#020617] rounded-2xl p-4">
          <p className="text-xs text-slate-400">Projeção final</p>
          <p className="text-lg font-bold text-cyan-400 mt-1">
            R$ {Math.floor(projecao).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-[#020617] rounded-2xl p-4">
          <p className="text-xs text-slate-400">Necessário/dia</p>
          <p className="text-lg font-bold text-white mt-1">
            R$ {Math.floor(diaria).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-[#020617] rounded-2xl p-4">
          <p className="text-xs text-slate-400">Média atual</p>
          <p className="text-lg font-bold text-white mt-1">
            R$ {mediaAtual.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* FOOTER ALERTA */}
      <div
        className={`mt-6 rounded-2xl p-4 text-sm font-medium text-center ${
          status
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}
      >
        {status ? (
          <>
            Tendência positiva • Meta deve ser atingida
          </>
        ) : (
          <>
            Faltam R$ {Math.floor(faltam).toLocaleString("pt-BR")} para
            atingir a meta
          </>
        )}
      </div>
    </div>
  );
}