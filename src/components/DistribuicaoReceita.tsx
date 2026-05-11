import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function DistribuicaoReceita({
  pos,
  residencial,
  aparelhos,
  acessorios,
}) {
  const total = pos + residencial + aparelhos + acessorios;

  const data = [
    { name: "Pós Total", value: pos, color: "#22c55e" },
    { name: "Residencial", value: residencial, color: "#a855f7" },
    { name: "Aparelhos", value: aparelhos, color: "#38bdf8" },
    { name: "Acessórios", value: acessorios, color: "#f59e0b" },
  ];

  const calcPct = (v: number) =>
    total === 0 ? 0 : ((v / total) * 100).toFixed(0);

  return (
    <div className="h-full flex items-center justify-center gap-6">

      <div className="w-[220px] h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              stroke="none"
            >
              {data.map((item, i) => (
                <Cell key={i} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 text-sm w-[220px]">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: item.color }}
              />
              {item.name}
            </span>

            <span>{calcPct(item.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}