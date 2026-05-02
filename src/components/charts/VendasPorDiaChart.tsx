import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatMoeda } from "../../utils/format";

type Props = {
  vendas: any[];
};

export default function VendasPorDiaChart({ vendas }: Props) {
  // Agrupa vendas por dia
  const data = vendas.reduce((acc: any[], venda) => {
    const dia = new Date(venda.data).toLocaleDateString("pt-BR");

    const existente = acc.find((item) => item.dia === dia);

    if (existente) {
      existente.valor += venda.valor;
    } else {
      acc.push({ dia, valor: venda.valor });
    }

    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
        />

        <XAxis
          dataKey="dia"
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
        />

        <YAxis
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => formatMoeda(v)}
        />

        {/* ✅ TOOLTIP DARK – SEM FUNDO CINZA */}
        <Tooltip
          cursor={false} // <<< ISSO REMOVE O FUNDO CINZA ✅
          contentStyle={{
            backgroundColor: "#020617",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#38bdf8" }}
          formatter={(value: number) => formatMoeda(value)}
        />

        <Line
          type="monotone"
          dataKey="valor"
          stroke="#38bdf8"
          strokeWidth={2}
          dot={{ r: 4, fill: "#38bdf8" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}