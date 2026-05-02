import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  Headphones,
  CalendarDays,
  Target,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useVendas } from "../features/vendas/context/VendasContext";
import VendasPorDiaChart from "../components/charts/VendasPorDiaChart";
import ReceitaMensalChart from "../components/charts/ReceitaMensalChart";
import { formatMoeda } from "../utils/format";

export default function Dashboard() {
  const { vendas } = useVendas();

  const [mesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | undefined>(
    new Date()
  );

  const vendasDoMes = vendas.filter((v) => {
    const d = new Date(v.data);
    return (
      d.getMonth() === mesAtual.getMonth() &&
      d.getFullYear() === mesAtual.getFullYear()
    );
  });

  const vendasDoDia = useMemo(() => {
    if (!diaSelecionado) return [];
    return vendas.filter((v) => {
      const d = new Date(v.data);
      return (
        d.getDate() === diaSelecionado.getDate() &&
        d.getMonth() === diaSelecionado.getMonth() &&
        d.getFullYear() === diaSelecionado.getFullYear()
      );
    });
  }, [vendas, diaSelecionado]);

  const receitaTotal = vendasDoMes.reduce((a, b) => a + b.valor, 0);
  const receitaDia = vendasDoDia.reduce((a, b) => a + b.valor, 0);

  const qtdPos = contarCategoria(vendasDoMes, "Pos");
  const qtdResidencial = contarCategoria(vendasDoMes, "Residencial");
  const qtdAparelhos = contarCategoria(vendasDoMes, "Aparelhos");
  const qtdAcessorios = contarCategoria(vendasDoMes, "Acessorios");

  const vendasQtdDia = contarItens(vendasDoDia);

  const META_MENSAL = 30000;
  const pctMeta = Math.min((receitaTotal / META_MENSAL) * 100, 100);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá Marcelo</h1>
          <p className="text-slate-400 mt-1">
            Resumo Comercial •{" "}
            {mesAtual.toLocaleString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f172a] border border-white/10">
            <ChevronLeft size={18} />
            <CalendarDays size={18} className="text-cyan-400" />
            <span className="capitalize min-w-[130px] text-center">
              {mesAtual.toLocaleString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <ChevronRight size={18} />
          </div>

          <button className="relative p-3 rounded-2xl bg-[#0f172a] border border-white/10">
            <Bell size={20} className="text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      </div>

      {/* CARDS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard title="Receita Total" value={formatMoeda(receitaTotal)} icon={<Wallet />} color="cyan" />
        <StatCard title="Pós Total" value={qtdPos} icon={<Smartphone />} color="cyan" />
        <StatCard title="Residencial" value={qtdResidencial} icon={<Wifi />} color="green" />
        <StatCard title="Aparelhos" value={qtdAparelhos} icon={<MonitorSmartphone />} color="purple" />
        <StatCard title="Acessórios" value={qtdAcessorios} icon={<Headphones />} color="yellow" />
      </div>

      {/* GRÁFICO + CALENDÁRIO */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 rounded-3xl bg-[#0b1220] border border-white/10 p-6">
          <h2 className="font-semibold mb-4">Vendas por dia</h2>
          <VendasPorDiaChart vendas={vendasDoMes} />
        </div>

        <div className="xl:col-span-2 rounded-3xl bg-[#0b1220] border border-white/10 p-6">
          <h2 className="font-semibold mb-4">Calendário Inteligente</h2>

          <div className="grid grid-cols-2 gap-4 items-start">
            <DayPicker
              mode="single"
              selected={diaSelecionado}
              onSelect={setDiaSelecionado}
              showOutsideDays
            />

            <div className="space-y-3">
              <CalendarInfo label="Receita do dia" value={formatMoeda(receitaDia)} />
              <CalendarInfo label="Vendas do dia" value={`${vendasQtdDia} vendas`} />
              <CalendarInfo label="Receita do mês" value={formatMoeda(receitaTotal)} />
              <CalendarInfo label="Meta mensal" value={`${pctMeta.toFixed(0)}%`} />
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO INFERIOR */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-[#0b1220] border border-white/10 p-6">
          <h2 className="font-semibold mb-4">Receita mensal</h2>
          <ReceitaMensalChart vendas={vendasDoMes} />
        </div>

        <UltimasVendas vendas={vendasDoMes} />
      </div>

      <style>{`
        .rdp { --rdp-cell-size: 40px; }
        .rdp-day_selected {
          background-color: #2563eb !important;
          color: white !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

// === COMPONENTES ===

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    cyan: "text-cyan-400",
    green: "text-emerald-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="rounded-3xl bg-[#0b1220] border border-white/10 p-5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{title}</span>
        <div className={colors[color]}>{icon}</div>
      </div>

      <h3 className="text-2xl font-bold mt-3">{value}</h3>

      <div className="mt-4 flex gap-1 h-8 items-end">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-2 rounded bg-cyan-400"
            style={{ height: `${6 + i * 3}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function CalendarInfo({ label, value }: any) {
  return (
    <div className="flex justify-between items-center bg-[#020617] border border-white/10 rounded-xl p-3">
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
      <CalendarDays size={18} className="text-cyan-400" />
    </div>
  );
}

function UltimasVendas({ vendas }: any) {
  return (
    <div className="rounded-3xl bg-[#0b1220] border border-white/10 p-6">
      <h2 className="font-semibold mb-4">Últimas vendas</h2>
      <div className="space-y-3">
        {vendas.slice(-5).reverse().map((v: any, i: number) => (
          <div
            key={i}
            className="flex justify-between bg-[#020617] border border-white/10 p-3 rounded-xl"
          >
            <div>
              <p className="font-medium">{v.produto}</p>
              <p className="text-xs text-slate-400">{v.clienteNome}</p>
            </div>
            <span>{formatMoeda(v.valor)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// === UTILS ===

function contarItens(vendas: any[]) {
  return vendas.reduce(
    (t, v) =>
      Array.isArray(v.itens)
        ? t + v.itens.reduce((s: number, i: any) => s + (i.quantidade || 1), 0)
        : t + 1,
    0
  );
}

function contarCategoria(vendas: any[], categoria: string) {
  return vendas.reduce(
    (t, v) =>
      Array.isArray(v.itens)
        ? t +
            v.itens.reduce(
              (s: number, i: any) =>
                i.categoria === categoria ? s + (i.quantidade || 1) : s,
              0
            )
        : v.categoria === categoria
        ? t + 1
        : t,
    0
  );
}