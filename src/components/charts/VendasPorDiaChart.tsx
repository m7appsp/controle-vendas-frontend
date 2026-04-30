import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { Venda } from "../../features/vendas/domain/Venda";

type Props = {
  vendas: Venda[];
};

export default function VendasPorDiaChart({ vendas }: Props) {
  const dataPorDia = Object.values(
    vendas.reduce((acc, venda) => {
      const dia = new Date(venda.data).toLocaleDateString("pt-BR");

      if (!acc[dia]) {
        acc[dia] = { dia, total: 0 };
      }

      acc[dia].total += venda.valor;
      return acc;
    }, {} as Record<string, { dia: string; total: number }>)
  );

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataPorDia}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

          <XAxis
            dataKey="dia"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ fill: "#06b6d4", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}