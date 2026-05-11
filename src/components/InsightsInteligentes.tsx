import { CheckCircle, AlertTriangle, TrendingDown } from "lucide-react";

export default function InsightsInteligentes({ insights }: any) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0b1220] rounded-3xl border border-white/10 p-6 space-y-4">
      <h2 className="text-lg font-semibold">Insights Inteligentes</h2>

      <div className="space-y-3">
        {insights.map((insight: any, index: number) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-xl ${
              insight.tipo === "positivo"
                ? "bg-green-500/10 text-green-400"
                : insight.tipo === "alerta"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {insight.tipo === "positivo" && <CheckCircle size={20} />}
            {insight.tipo === "alerta" && <AlertTriangle size={20} />}
            {insight.tipo === "negativo" && <TrendingDown size={20} />}

            <p className="text-sm">{insight.mensagem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}