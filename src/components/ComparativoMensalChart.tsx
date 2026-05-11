import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ComparativoMensalChart({
  atual = 0,
  passado = 0,
}: any) {
  const data = [
    { name: "Mês passado", valor: passado || 0 },
    { name: "Mês atual", valor: atual || 0 },
  ];

  return (
    <div className="w-full min-h-[300px]">

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#94a3b8"
            tickFormatter={(value) =>
              `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
            }
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #1e293b",
              borderRadius: "10px",
            }}
            formatter={(value: any) =>
              `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
            }
          />

          <Line
            type="monotone"
            dataKey="valor"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}