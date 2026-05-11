import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DonutAparelhosAcessorios({ aparelhos, acessorios }) {
  const data = [
    { name: "Aparelhos", value: aparelhos },
    { name: "Acessórios", value: acessorios },
  ];

  const COLORS = ["#38bdf8", "#22c55e"];

  const total = aparelhos + acessorios;

  const porcentagem = (valor) =>
    total === 0 ? 0 : ((valor / total) * 100).toFixed(1);

  return (
    <div>
      <h3 className="mb-2 text-sm text-slate-400">
        Mix de Vendas (Aparelho vs Acessório)
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-between mt-2 text-sm">
        <span>Aparelhos: {porcentagem(aparelhos)}%</span>
        <span>Acessórios: {porcentagem(acessorios)}%</span>
      </div>
    </div>
  );
}