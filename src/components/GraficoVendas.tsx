import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraficoVendas({ vendas }: any) {
  // Agrupar vendas por dia
  const dadosAgrupados: any = {};

  vendas.forEach((v: any) => {
    const data = new Date(v.data).toLocaleDateString();

    if (!dadosAgrupados[data]) {
      dadosAgrupados[data] = 0;
    }

    dadosAgrupados[data] += Number(v.valor || 0);
  });

  const dados = Object.keys(dadosAgrupados).map((data) => ({
    data,
    total: dadosAgrupados[data],
  }));

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">Vendas por dia</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados}>
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6366F1"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}