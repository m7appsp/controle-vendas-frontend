import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  CalendarDays,
  Bell,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react";

import { useVendas } from "../features/vendas/context/VendasContext";
import VendasPorDiaChart from "../components/charts/VendasPorDiaChart";
import ReceitaMensalChart from "../components/charts/ReceitaMensalChart";
import { formatMoeda } from "../utils/format";

/* =================================================
   DASHBOARD
================================================= */

function Dashboard() {
  const { vendas } = useVendas();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  /* =========================
     FILTRO POR MÊS
  ========================= */
  const vendasFiltradas = vendas.filter((venda) => {
    const data = new Date(venda.data);
    return (
      data.getMonth() === selectedMonth.getMonth() &&
      data.getFullYear() === selectedMonth.getFullYear()
    );
  });

  /* =========================
     MÉTRICAS
  ========================= */
  const receitaTotal = vendasFiltradas.reduce(
    (acc, venda) => acc + venda.valor,
    0
  );

  const totalPos = contarCategoria(vendasFiltradas, "Pos");
  const totalResidencial = contarCategoria(vendasFiltradas, "Residencial");
  const totalAparelhos = contarCategoria(vendasFiltradas, "Aparelhos");

  const META_MENSAL = 30000;

  function alterarMes(valor: number) {
    const novaData = new Date(selectedMonth);
    novaData.setMonth(novaData.getMonth() + valor);
    setSelectedMonth(novaData);
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white p-6 space-y-6">
      {/* =========================
         HEADER
      ========================= */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold">Painel Comercial</h1>
          <p className="text-slate-400 mt-1">
            Resumo Comercial •{" "}
            {selectedMonth.toLocaleString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f172a] border border-white/10">
            <button onClick={() => alterarMes(-1)}>
              <ChevronLeft />
            </button>

            <CalendarDays size={18} className="text-cyan-400" />

            <span className="capitalize min-w-[120px] text-center">
              {selectedMonth.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button onClick={() => alterarMes(1)}>
              <ChevronRight />
            </button>
          </div>

          <button className="relative p-3 rounded-2xl bg-[#0f172a] border border-white/10">
            <Bell size={20} className="text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      </div>

      {/* =========================
         CARDS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          title="Receita Total"
          value={formatMoeda(receitaTotal)}
          icon={<Wallet size={20} />}
          values={ultimos7Dias(vendasFiltradas)}
          accent="cyan"
        />

        <StatCard
          title="Pos Total"
          value={`${totalPos} vendas`}
          icon={<Smartphone size={20} />}
          values={ultimos7DiasCategoria(vendasFiltradas, "Pos")}
          accent="purple"
        />

        <StatCard
          title="Residencial"
          value={`${totalResidencial} vendas`}
          icon={<Wifi size={20} />}
          values={ultimos7DiasCategoria(vendasFiltradas, "Residencial")}
          accent="green"
        />

        <StatCard
          title="Aparelhos"
          value={`${totalAparelhos} vendas`}
          icon={<MonitorSmartphone size={20} />}
          values={ultimos7DiasCategoria(vendasFiltradas, "Aparelhos")}
          accent="yellow"
        />

        <MetaMensalCard atual={receitaTotal} meta={META_MENSAL} />
      </div>

      {/* =========================
         GRÁFICO + CALENDÁRIO
      ========================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6">
          <h2 className="text-lg font-semibold mb-4">Vendas por dia</h2>
          <VendasPorDiaChart vendas={vendasFiltradas} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="text-cyan-400" size={18} />
            <h2 className="font-semibold">Calendário Inteligente</h2>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
      </div>

      {/* =========================
         RECEITA MENSAL
      ========================= */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6">
        <h2 className="text-lg font-semibold mb-4">Receita mensal</h2>
        <ReceitaMensalChart vendas={vendasFiltradas} />
      </div>
    </div>
  );
}

/* =================================================
   FUNÇÕES AUXILIARES
================================================= */

function contarCategoria(vendas: any[], categoria: string) {
  return vendas.filter((venda) => venda.categoria === categoria).length;
}

function ultimos7Dias(vendas: any[]) {
  return agruparUltimos7Dias(vendas);
}

function ultimos7DiasCategoria(vendas: any[], categoria: string) {
  return agruparUltimos7Dias(
    vendas.filter((venda) => venda.categoria === categoria)
  );
}

function agruparUltimos7Dias(vendas: any[]) {
  const dias = Array(7).fill(0);

  vendas.forEach((venda) => {
    const dataVenda = new Date(venda.data);
    const hoje = new Date();

    const diff = Math.floor(
      (hoje.getTime() - dataVenda.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff >= 0 && diff < 7) {
      dias[6 - diff] += 1;
    }
  });

  return dias;
}

/* =================================================
   STAT CARD
================================================= */

function StatCard({
  title,
  value,
  icon,
  values,
  accent = "cyan",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  values: number[];
  accent?: "cyan" | "green" | "purple" | "yellow";
}) {
  const max = Math.max(...values, 1);

  const accentMap = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-400/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-400/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-400/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-400/20",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-5 shadow-[0_0_35px_rgba(6,182,212,0.08)] hover:shadow-[0_0_50px_rgba(6,182,212,0.18)] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{title}</span>

        <div className={`p-3 rounded-2xl border ${accentMap[accent]}`}>
          {icon}
        </div>
      </div>

      <h3 className="text-3xl font-bold mt-6">{value}</h3>

      <div className="mt-5 flex items-end gap-1 h-12">
        {values.map((item, index) => (
          <div
            key={index}
            className="w-2 rounded-full bg-cyan-400"
            style={{
              height: `${Math.max((item / max) * 40, 6)}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* =================================================
   META MENSAL CARD
================================================= */

function MetaMensalCard({
  atual,
  meta,
}: {
  atual: number;
  meta: number;
}) {
  const percentual = Math.min((atual / meta) * 100, 100);
  const restante = Math.max(meta - atual, 0);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-5 shadow-[0_0_40px_rgba(34,197,94,0.12)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">Meta Mensal</span>

        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
          <Target size={20} />
        </div>
      </div>

      <h3 className="text-2xl font-bold mt-4">
        {formatMoeda(atual)}{" "}
        <span className="text-slate-400 text-sm">
          / {formatMoeda(meta)}
        </span>
      </h3>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all"
            style={{ width: `${percentual}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{percentual.toFixed(1)}% da meta</span>
          <span>Faltam {formatMoeda(restante)}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;