const data = [
  { label: "Jan", value: 70 },
  { label: "Fev", value: 50 },
  { label: "Mar", value: 80 },
];

export default function BarHorizontal() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-72">

      {data.map((item, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-2 bg-indigo-500 rounded-full"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}

    </div>
  );
}