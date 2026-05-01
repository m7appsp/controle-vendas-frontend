import { Target } from "lucide-react";
import { formatMoeda } from "../utils/format";

type Props = {
  atual: number;
  meta: number;
};

export default function MetaMensalCard({ atual, meta }: Props) {
  const percentual = Math.min((atual / meta) * 100, 100);
  const restante = Math.max(meta - atual, 0);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-5 shadow-[0_0_40px_rgba(34,197,94,0.12)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Meta Mensal</span>

        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
          <Target size={20} />
        </div>
      </div>

      <h3 className="text-2xl font-bold mt-4">
        {formatMoeda(atual)}{" "}
        <span className="text-slate-400 text-sm">
          / {formatMoeda(meta)}
        </span>
      </h3>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all"
            style={{ width: `${percentual}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{percentual.toFixed(1)}% da meta</span>
          <span>Faltam {formatMoeda(restante)}</span>
        </div>
      </div>
    </div>
  );
}