import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Venda } from "../../features/vendas/domain/Venda";

type Props = {
  vendas: Venda[];
};

function mesLabel(ano: number, mes: number) {
  return new Date(ano, mes).toLocaleString("pt-BR", { month: "short" });
}

export default function ReceitaMensalChart({ vendas }: Props) {
  const mapa = new Map<string, number>();

  vendas.forEach((v) => {
    const d = new Date(v.data);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    mapa.set(key, (mapa.get(key) || 0) + v.valor);
  });

  const data = Array.from(mapa.entries()).map(([key, total]) => {
    const [ano, mes] = key.split("-").map(Number);
    return {
      mes: mesLabel(ano, mes),
      total,
    };
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Receita mensal</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}