import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  period: string;
};

export default function MainChart({ period }: Props) {

  const dataMap: any = {
    "7d": [
      { name: "Seg", uv: 10 },
      { name: "Ter", uv: 20 },
      { name: "Qua", uv: 15 },
      { name: "Qui", uv: 30 },
      { name: "Sex", uv: 25 },
    ],
    "30d": [
      { name: "1", uv: 10 },
      { name: "10", uv: 40 },
      { name: "20", uv: 20 },
      { name: "30", uv: 50 },
    ],
    "12m": [
      { name: "Jan", uv: 30 },
      { name: "Jun", uv: 80 },
      { name: "Dez", uv: 60 },
    ],
  };

  const data = dataMap[period] || dataMap["7d"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-72">

      <div style={{ width: "100%", height: "100%" }}>

        <ResponsiveContainer>
          <AreaChart data={data}>

            {/* GRADIENTE */}
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="uv"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#colorUv)"
              isAnimationActive={true}
              animationDuration={1200}
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}