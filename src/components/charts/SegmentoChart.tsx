import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const dados = [
  { nome: 'Pós', valor: 120 },
  { nome: 'Residencial', valor: 45 },
  { nome: 'Avançado', valor: 18 },
];

const cores = ['#22C55E', '#6366F1', '#F59E0B'];

export default function SegmentoChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={4}
        >
          {dados.map((_, index) => (
            <Cell key={index} fill={cores[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
