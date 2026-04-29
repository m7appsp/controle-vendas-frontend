import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Progress", value: 75 },
  { name: "Rest", value: 25 },
];

export default function DonutChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-72 flex items-center justify-center">
      
      <div className="relative">

        <PieChart width={180} height={180}>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationDuration={1000}
          >
            <Cell fill="#6366f1" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>

        {/* TEXTO CENTRAL */}
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-700">
          75%
        </div>

      </div>

    </div>
  );
}