import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
  { v: 5 },
  { v: 10 },
  { v: 8 },
  { v: 12 },
  { v: 9 },
  { v: 14 },
];

export default function MiniChart() {
  return (
    <div style={{ width: "100%", height: 40 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}