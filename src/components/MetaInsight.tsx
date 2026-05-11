export default function MetaInsight({
  meta,
  projecao,
  diaria,
  status,
}: any) {
  const progresso =
    meta === 0 ? 0 : Math.min((projecao / meta) * 100, 100);

  return (
    <div className="rounded-3xl bg-[#0b1220] border border-white/10 p-6">

      <div className="grid grid-cols-2 gap-6 items-center">

        <div>
          <h3 className="text-lg font-semibold mb-5">
            Projeção de Meta
          </h3>

          <div className="space-y-3 text-sm">
            <p>
              Meta Mensal: <strong>R$ {Number(meta || 0).toLocaleString()}</strong>
            </p>

            <p>
              Projeção: <strong>R$ {Math.floor(projecao || 0).toLocaleString()}</strong>
            </p>

            <p>
              Necessário/dia: <strong>R$ {Math.floor(diaria || 0).toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">
                {progresso.toFixed(0)}%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                da meta atingida
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-6 p-4 rounded-xl text-center font-semibold ${
          status
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {status
          ? "Tendência positiva: meta será atingida"
          : "⚠ Atenção: ritmo abaixo da meta"}
      </div>
    </div>
  );
}