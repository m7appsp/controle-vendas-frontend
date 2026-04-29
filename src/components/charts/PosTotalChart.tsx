import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const dados = [
  { nome: 'Pós Titular', valor: 40 },
  { nome: 'Controle', valor: 30 },
  { nome: 'Migra Pós', valor: 25 },
  { nome: 'Banda Larga', valor: 25 },
];

export default function PosTotalChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={dados}>
        <CartesianGrid stroke="#E5E7EB" />
        <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar
          dataKey="valor"
          fill="#22C55E"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}