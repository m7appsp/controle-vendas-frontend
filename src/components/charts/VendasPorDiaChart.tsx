import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Venda } from "../../features/vendas/domain/Venda";

type Props = {
  vendas: Venda[];
};

export default function VendasPorDiaChart({ vendas }: Props) {
  const dataPorDia = Object.values(
    vendas.reduce((acc, venda) => {
      const dia = new Date(venda.data).toLocaleDateString();

      if (!acc[dia]) {
        acc[dia] = { dia, total: 0 };
      }

      acc[dia].total += venda.valor;
      return acc;
    }, {} as Record<string, { dia: string; total: number }>)
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Vendas por dia</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataPorDia}>
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}