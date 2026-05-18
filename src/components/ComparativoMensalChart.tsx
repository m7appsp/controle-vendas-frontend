import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function ComparativoMensalChart({
  atual = 0,
  passado = 0,
}: any) {
  const data = [
    { name: "Mês passado", valor: passado || 0 },
    { name: "Mês atual", valor: atual || 0 },
  ];

  const crescimento =
    passado > 0
      ? (((atual - passado) / passado) * 100).toFixed(1)
      : 0;

  const meta = Math.max(atual, passado) * 1.2;

  return (
    <div className="w-full min-h-[320px] flex flex-col">
      {/* HEADER PREMIUM */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Comparativo do mês
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Evolução comercial mensal
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            R$ {Number(atual).toLocaleString("pt-BR")}
          </p>

          <p
            className={`text-sm font-medium ${
              Number(crescimento) >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {Number(crescimento) >= 0 ? "+" : ""}
            {crescimento}% vs anterior
          </p>
        </div>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="colorReceita"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="4 4"
            opacity={0.2}
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              `R$ ${Number(value).toLocaleString("pt-BR")}`
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: "16px",
              color: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            }}
            formatter={(value: any) => [
              `R$ ${Number(value).toLocaleString("pt-BR")}`,
              "Receita",
            ]}
          />

          {/* META */}
          <ReferenceLine
            y={meta}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            opacity={0.6}
            label={{
              value: "Meta",
              position: "right",
              fill: "#f59e0b",
              fontSize: 12,
            }}
          />

          <Area
            type="monotone"
            dataKey="valor"
            stroke="#06b6d4"
            strokeWidth={4}
            fill="url(#colorReceita)"
            dot={{
              r: 5,
              fill: "#06b6d4",
              strokeWidth: 2,
              stroke: "#ffffff",
            }}
            activeDot={{
              r: 8,
              fill: "#06b6d4",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}