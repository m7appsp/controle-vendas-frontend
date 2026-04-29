import { useVendas } from "../features/vendas/context/VendasContext";

import {
  receitaHoje,
  receitaSemana,
  receitaMes,
  receitaAno,
  crescimentoMensal,
  clientesUnicos,
} from "../features/vendas/services/calculos";

import VendasPorDiaChart from "../components/charts/VendasPorDiaChart";
import ReceitaMensalChart from "../components/charts/ReceitaMensalChart";

import { formatMoeda } from "../utils/format";

function Dashboard() {
  const { vendas } = useVendas();

  const hoje = receitaHoje(vendas);
  const semana = receitaSemana(vendas);
  const mes = receitaMes(vendas);
  const ano = receitaAno(vendas);
  const crescimento = crescimentoMensal(vendas);
  const clientes = clientesUnicos(vendas);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500">Visão geral das vendas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Receita Hoje" value={formatMoeda(hoje)} />
        <Card title="Receita Semana" value={formatMoeda(semana)} />
        <Card title="Receita Mês" value={formatMoeda(mes)} />
        <Card title="Clientes" value={clientes} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-sm text-gray-500">Crescimento mensal</p>
        <p className="text-2xl font-bold">{crescimento.toFixed(1)}%</p>
        <p className="text-xs text-gray-400 mt-1">
          Receita anual: {formatMoeda(ano)}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <VendasPorDiaChart vendas={vendas} />
        <ReceitaMensalChart vendas={vendas} />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Últimas Vendas</h2>

        {vendas.length === 0 ? (
          <p className="text-gray-500">Nenhuma venda registrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Produto</th>
                <th className="text-left py-2">Cliente</th>
                <th className="text-right py-2">Valor</th>
                <th className="text-right py-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {vendas
                .slice()
                .reverse()
                .map((venda) => (
                  <tr key={venda.id} className="border-b last:border-0">
                    <td className="py-2">{venda.produto}</td>
                    <td className="py-2">{venda.clienteNome}</td>
                    <td className="py-2 text-right">
                      {formatMoeda(venda.valor)}
                    </td>
                    <td className="py-2 text-right">
                      {new Date(venda.data).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default Dashboard;