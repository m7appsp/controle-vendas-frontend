import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  Headphones,
} from "lucide-react";

import { formatMoeda } from "../utils/format";
import { useDashboardData } from "../hooks/useDashboardData";

import StatCard from "../components/ui/StatCard";
import DistribuicaoReceita from "../components/DistribuicaoReceita";
import ComparativoMensalChart from "../components/ComparativoMensalChart";
import MetaInsight from "../components/MetaInsight";
import InsightsInteligentes from "../components/InsightsInteligentes";

export default function Dashboard() {
  const hoje = new Date();
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(hoje);

  const {
    receitaTotal,
    pos,
    residencial,
    aparelhos,
    acessorios,
    vendasIndividuais,

    receitaAtual,
    receitaPassado,

    metaMensal,
    projecaoFinal,
    metaPorDia,
    vaiBaterMeta,

    insights,

    loading,
    erro,
  } = useDashboardData(
    hoje.getMonth() + 1,
    hoje.getFullYear(),
    diaSelecionado
  );

  if (loading) {
    return <div className="p-6 text-white">Carregando…</div>;
  }

  if (erro) {
    return <div className="p-6 text-red-500">{erro}</div>;
  }

  const vendasDoDia =
    vendasIndividuais?.filter((v) => {
      const d = new Date(v.data);
      return d.toDateString() === diaSelecionado.toDateString();
    }) || [];

  const receitaDia = vendasDoDia.reduce(
    (acc, v) => acc + Number(v.receita || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">Olá Marcelo</h1>
        <p className="text-slate-400 mt-1">
          Resumo Comercial •{" "}
          {hoje.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          title="Receita Total"
          value={formatMoeda(receitaTotal)}
          icon={<Wallet />}
          meta={metaMensal}
          realizado={receitaTotal}
        />

        <StatCard title="Pós" value={pos} icon={<Smartphone />} />
        <StatCard title="Residencial" value={residencial} icon={<Wifi />} />
        <StatCard title="Aparelhos" value={aparelhos} icon={<MonitorSmartphone />} />
        <StatCard title="Acessórios" value={acessorios} icon={<Headphones />} />
      </div>

      {/* ================= ZONA PRINCIPAL ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* DISTRIBUIÇÃO DE RECEITA */}
        <div className="bg-[#0b1220] rounded-3xl border border-white/10 p-6">
          <DistribuicaoReceita
            pos={pos}
            residencial={residencial}
            aparelhos={aparelhos}
            acessorios={acessorios}
          />
        </div>

        {/* CALENDÁRIO */}
        <div className="bg-[#0b1220] rounded-3xl border border-white/10 p-6 flex justify-center">
          <DayPicker
            mode="single"
            selected={diaSelecionado}
            onSelect={(d) => d && setDiaSelecionado(d)}
          />
        </div>

        {/* DIA SELECIONADO */}
        <div className="bg-white text-blue-600 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase text-blue-400">
              Dia selecionado
            </p>

            <h2 className="text-6xl font-bold mt-2">
              {diaSelecionado.getDate()}
            </h2>

            <p className="text-sm mt-1">
              {diaSelecionado.toLocaleDateString("pt-BR", {
                weekday: "long",
                month: "long",
              })}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-blue-400">
              Receita do dia
            </p>

            <p className="text-2xl font-bold">
              {formatMoeda(receitaDia)}
            </p>

            <p className="text-xs mt-2 text-blue-400">
              Visualizando dados do dia selecionado
            </p>
          </div>
        </div>

      </div>

      {/* ================= COMPARATIVO ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 bg-[#0b1220] rounded-3xl border border-white/10 p-6 min-h-[350px]">
          <h2 className="text-lg font-semibold mb-4">
            Comparativo do mês
          </h2>

          <ComparativoMensalChart
            atual={receitaAtual}
            passado={receitaPassado}
          />
        </div>

        {/* PROJEÇÃO DE META */}
        <MetaInsight
          meta={metaMensal}
          projecao={projecaoFinal}
          diaria={metaPorDia}
          status={vaiBaterMeta}
        />

      </div>

      {/* ================= INSIGHTS ================= */}
      <InsightsInteligentes insights={insights} />

    </div>
  );
}