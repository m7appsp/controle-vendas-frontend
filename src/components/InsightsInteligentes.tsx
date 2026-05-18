import {
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Trophy,
  Target,
  DollarSign,
  CalendarDays,
  BarChart3,
} from "lucide-react";

type Props = {
  insights?: any[];
  melhorDia?: any;
  piorDia?: any;
  ticketMedio?: number;
  metaDia?: number;
  rankingServicos?: any[];
};

export default function InsightsInteligentes({
  insights = [],
  melhorDia,
  piorDia,
  ticketMedio = 0,
  metaDia = 0,
  rankingServicos = [],
}: Props) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-[#0b1220] rounded-3xl border border-white/10 p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Insights Inteligentes
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Performance comercial e alertas automáticos
        </p>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#020617] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Melhor dia</span>
            <Trophy size={18} className="text-yellow-400" />
          </div>

          <p className="text-xl font-bold mt-3">
            {melhorDia
              ? `R$ ${Number(melhorDia.valor).toLocaleString("pt-BR")}`
              : "R$ 0"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {melhorDia?.data || "--"}
          </p>
        </div>

        <div className="bg-[#020617] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Pior dia</span>
            <TrendingDown size={18} className="text-red-400" />
          </div>

          <p className="text-xl font-bold mt-3">
            {piorDia
              ? `R$ ${Number(piorDia.valor).toLocaleString("pt-BR")}`
              : "R$ 0"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {piorDia?.data || "--"}
          </p>
        </div>

        <div className="bg-[#020617] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Ticket médio</span>
            <DollarSign size={18} className="text-cyan-400" />
          </div>

          <p className="text-xl font-bold mt-3">
            R$ {Number(ticketMedio).toFixed(0)}
          </p>

          <p className="text-xs text-slate-500 mt-1">por venda</p>
        </div>

        <div className="bg-[#020617] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Meta diária</span>
            <Target size={18} className="text-green-400" />
          </div>

          <p className="text-xl font-bold mt-3">
            R$ {Number(metaDia).toLocaleString("pt-BR")}
          </p>

          <p className="text-xs text-slate-500 mt-1">necessário/dia</p>
        </div>
      </div>

      {/* ALERTAS */}
      <div className="space-y-3">
        {insights.map((insight: any, index: number) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${
              insight.tipo === "positivo"
                ? "bg-green-500/10 text-green-400 border-green-500/10"
                : insight.tipo === "alerta"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/10"
                : "bg-red-500/10 text-red-400 border-red-500/10"
            }`}
          >
            {insight.tipo === "positivo" && <CheckCircle size={20} />}
            {insight.tipo === "alerta" && <AlertTriangle size={20} />}
            {insight.tipo === "negativo" && <TrendingDown size={20} />}

            <p className="text-sm">{insight.mensagem}</p>
          </div>
        ))}
      </div>

      {/* RANKING */}
      <div className="bg-[#020617] rounded-2xl p-5 border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-cyan-400" />
          <h3 className="font-semibold">Top serviços vendidos</h3>
        </div>

        <div className="space-y-3">
          {rankingServicos.map((item: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.nome}</span>
                <span className="text-slate-400">{item.total}</span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-cyan-400 rounded-full"
                  style={{
                    width: `${
                      rankingServicos[0]
                        ? (item.total / rankingServicos[0].total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={14} />
        Atualizado com base nas vendas registradas do mês
      </div>
    </div>
  );
}