import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  DollarSign,
  TrendingUp,
  Users,
  CalendarDays,
  Bell,
  ChevronDown,
} from "lucide-react";

import { useVendas } from "../features/vendas/context/VendasContext";
import {
  receitaHoje,
  receitaSemana,
  receitaMes,
  receitaAno,
  clientesUnicos,
} from "../features/vendas/services/calculos";

import VendasPorDiaChart from "../components/charts/VendasPorDiaChart";
import ReceitaMensalChart from "../components/charts/ReceitaMensalChart";
import { formatMoeda } from "../utils/format";

function Dashboard() {
  const { vendas } = useVendas();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const vendasFiltradas = vendas.filter((venda) => {
    const data = new Date(venda.data);

    return (
      data.getMonth() === selectedMonth.getMonth() &&
      data.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const hoje = receitaHoje(vendasFiltradas);
  const semana = receitaSemana(vendasFiltradas);
  const mes = receitaMes(vendasFiltradas);
  const ano = receitaAno(vendasFiltradas);
  const clientes = clientesUnicos(vendasFiltradas);

  function alterarMes(valor: number) {
    const novaData = new Date(selectedMonth);
    novaData.setMonth(novaData.getMonth() + valor);
    setSelectedMonth(novaData);
  }

  return (
   
h1 className="text-2xl font-semibold">
  Dashboard atualizado
</h1>

 <div className="min-h-screen w-full bg-[#020617] text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Painel Comercial
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Resumo Comercial •{" "}
            {selectedMonth.toLocaleString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SELETOR MÊS */}
          <div
            className="
              flex items-center gap-3
              px-4 py-3
              rounded-2xl
              bg-[#0f172a]
              border border-white/10
              shadow-lg
            "
          >
            <button
              onClick={() => alterarMes(-1)}
              className="text-slate-400 hover:text-cyan-400 transition"
            >
              ‹
            </button>

            <CalendarDays size={18} className="text-cyan-400" />

            <span className="text-sm font-medium capitalize min-w-[120px] text-center">
              {selectedMonth.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <ChevronDown size={16} className="text-slate-500" />

            <button
              onClick={() => alterarMes(1)}
              className="text-slate-400 hover:text-cyan-400 transition"
            >
              ›
            </button>
          </div>

          {/* SINO */}
          <button
            className="
              relative
              p-3
              rounded-2xl
              bg-[#0f172a]
              border border-white/10
              hover:border-cyan-400/30
              transition
            "
          >
            <Bell size={20} className="text-cyan-400" />

            <span
              className="
                absolute -top-1 -right-1
                w-5 h-5 rounded-full
                bg-red-500 text-white text-xs
                flex items-center justify-center
              "
            >
              1
            </span>
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Receita Hoje"
          value={formatMoeda(hoje)}
          icon={<DollarSign size={20} />}
        />

        <StatCard
          title="Receita Semana"
          value={formatMoeda(semana)}
          icon={<TrendingUp size={20} />}
        />

        <StatCard
          title="Receita Mês"
          value={formatMoeda(mes)}
          icon={<DollarSign size={20} />}
        />

        <StatCard
          title="Clientes"
          value={clientes}
          icon={<Users size={20} />}
        />
      </div>

      {/* CHART + CALENDÁRIO */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6 shadow-[0_0_35px_rgba(6,182,212,0.05)]">
          <h2 className="text-lg font-semibold mb-4">Vendas por dia</h2>
          <VendasPorDiaChart vendas={vendasFiltradas} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6 shadow-[0_0_35px_rgba(6,182,212,0.05)]">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="text-cyan-400" size={18} />
            <h2 className="font-semibold">Calendário Inteligente</h2>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />

          <div className="mt-5 space-y-3">
            <ResumoCard label="Receita do Dia" value={formatMoeda(hoje)} />
            <ResumoCard label="Receita Semana" value={formatMoeda(semana)} />
            <ResumoCard label="Receita Mês" value={formatMoeda(mes)} />
          </div>
        </div>
      </div>

      {/* RECEITA MENSAL */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6 shadow-[0_0_35px_rgba(6,182,212,0.05)]">
        <h2 className="text-lg font-semibold mb-4">Receita mensal</h2>
        <ReceitaMensalChart vendas={vendasFiltradas} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-5 shadow-[0_0_35px_rgba(6,182,212,0.08)] hover:shadow-[0_0_45px_rgba(6,182,212,0.18)] transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{title}</span>

        <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/10">
          {icon}
        </div>
      </div>

      <h3 className="text-3xl font-bold mt-6">{value}</h3>
    </div>
  );
}

function ResumoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-cyan-400 font-semibold">{value}</span>
    </div>
  );
}

export default Dashboard;