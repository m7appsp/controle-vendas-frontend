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

  // Máscara manual que força o formato R$ 1.814
  const formatarParaPonto = (valor: number) => {
    const numeroInteiro = Math.round(Number(valor));
    const valorComPonto = numeroInteiro
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${valorComPonto}`;
  };

  return (
    <div className="w-full min-h-[320px] flex flex-col font-sans select-none">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
            Comparativo mensal
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Evolução comercial mensal
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatarParaPonto(atual)}
          </p>
          <p
            className={`text-sm font-medium mt-1 ${
              Number(crescimento) >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {Number(crescimento) >= 0 ? "+" : ""}
            {crescimento}% vs anterior
          </p>
        </div>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReceitaPremium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0072ff" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="4 4"
            vertical={false}
            opacity={0.2}
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            padding={{ left: 40, right: 40 }} // Garante respiro e alinhamento dos rótulos
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatarParaPonto(value)}
          />

          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            }}
            formatter={(value: any) => [formatarParaPonto(value), "Receita"]}
          />

          <ReferenceLine
            y={meta}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            opacity={0.4}
            label={{
              value: "Meta",
              position: "right",
              fill: "#f59e0b",
              fontSize: 12,
            }}
          />

          <Area
            type="linear"
            dataKey="valor"
            stroke="#00f2fe"
            strokeWidth={4}
            fill="url(#colorReceitaPremium)"
            className="drop-shadow-[0_4px_12px_rgba(0,242,254,0.3)]"
            dot={{
              r: 6,
              fill: "#020617",
              strokeWidth: 3,
              stroke: "#00f2fe",
            }}
            activeDot={{
              r: 8,
              fill: "#00f2fe",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}