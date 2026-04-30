import {
  BarChart,
  Bar,
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

function mesLabel(ano: number, mes: number) {
  return new Date(ano, mes).toLocaleString("pt-BR", {
    month: "short",
  });
}

export default function ReceitaMensalChart({ vendas }: Props) {
  const mapa = new Map<string, number>();

  vendas.forEach((venda) => {
    const data = new Date(venda.data);
    const key = `${data.getFullYear()}-${data.getMonth()}`;

    mapa.set(key, (mapa.get(key) || 0) + venda.valor);
  });

  const data = Array.from(mapa.entries()).map(([key, total]) => {
    const [ano, mes] = key.split("-").map(Number);

    return {
      mes: mesLabel(ano, mes),
      total,
    };
  });

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

          <XAxis
            dataKey="mes"
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

          <Bar
            dataKey="total"
            fill="#06b6d4"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}