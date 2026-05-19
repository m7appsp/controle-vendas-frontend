import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  Headphones,
  Target,
  TrendingUp,
  CalendarDays,
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

    metaReceita,
    projecaoFinal,
    metaDia,
    vaiBaterMeta,

    insights,
    melhorDia,
    piorDia,
    ticketMedio,
    rankingServicos,

    loading,
    erro,
  } = useDashboardData(
    hoje.getMonth() + 1,
    hoje.getFullYear(),
    diaSelecionado
  );

  if (loading) {
    return <div className="p-6 text-white">Carregando...</div>;
  }

  if (erro) {
    return <div className="p-6 text-red-500">{erro}</div>;
  }

  /* ======================
     FORMATA DATA LOCAL
     EVITA BUG UTC/FUSO
  ====================== */
  const formatarDataLocal = (data: Date) => {
    return `${data.getFullYear()}-${String(
      data.getMonth() + 1
    ).padStart(2, "0")}-${String(
      data.getDate()
    ).padStart(2, "0")}`;
  };

  /* ======================
     FILTRO DIA SELECIONADO
  ====================== */
  const vendasDoDia =
    vendasIndividuais?.filter((v: any) => {
      return v.data === formatarDataLocal(diaSelecionado);
    }) || [];

  const receitaDia = vendasDoDia.reduce(
    (acc: number, v: any) => acc + Number(v.receita || 0),
    0
  );

  const quantidadeDia = vendasDoDia.reduce(
    (acc: number, v: any) => acc + Number(v.quantidade || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Painel de Análise</h1>

        <p className="text-slate-400 mt-1">
          Resumo Comercial •{" "}
          {hoje.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          title="Receita Total"
          value={formatMoeda(receitaTotal)}
          icon={<Wallet />}
          meta={metaReceita}
          realizado={receitaTotal}
        />

        <StatCard
          title="Pós"
          value={pos}
          icon={<Smartphone />}
          meta={120}
          realizado={pos}
        />

        <StatCard
          title="Residencial"
          value={residencial}
          icon={<Wifi />}
          meta={80}
          realizado={residencial}
        />

        <StatCard
          title="Aparelhos"
          value={aparelhos}
          icon={<MonitorSmartphone />}
          meta={40}
          realizado={aparelhos}
        />

        <StatCard
          title="Acessórios"
          value={acessorios}
          icon={<Headphones />}
          meta={60}
          realizado={acessorios}
        />
      </div>

      {/* BLOCO PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* DISTRIBUIÇÃO */}
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
        <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <CalendarDays size={18} />
              <p className="text-sm font-medium uppercase">
                Dia selecionado
              </p>
            </div>

            <h2 className="text-6xl font-bold mt-3">
              {diaSelecionado.getDate()}
            </h2>

            <p className="text-sm mt-2 text-slate-500 capitalize">
              {diaSelecionado.toLocaleDateString("pt-BR", {
                weekday: "long",
                month: "long",
              })}
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <div className="bg-slate-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp size={16} />
                <span className="text-xs uppercase font-semibold">
                  Receita do dia
                </span>
              </div>

              <p className="text-2xl font-bold mt-2">
                {formatMoeda(receitaDia)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-xs text-slate-500">
                  Itens vendidos
                </p>
                <p className="text-xl font-bold mt-1">
                  {quantidadeDia}
                </p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <div className="flex items-center gap-1 text-blue-600">
                  <Target size={14} />
                  <p className="text-xs">Meta/dia</p>
                </div>

                <p className="text-xl font-bold mt-1">
                  {formatMoeda(metaDia)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVO + META */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#0b1220] rounded-3xl border border-white/10 p-6 min-h-[350px]">
          <ComparativoMensalChart
            atual={receitaTotal}
            passado={receitaTotal * 0.82}
          />
        </div>

        <MetaInsight
          meta={metaReceita}
          projecao={projecaoFinal}
          diaria={metaDia}
          status={vaiBaterMeta}
        />
      </div>

      {/* INSIGHTS */}
      <InsightsInteligentes
        insights={insights}
        melhorDia={melhorDia}
        piorDia={piorDia}
        ticketMedio={ticketMedio}
        rankingServicos={rankingServicos}
      />
    </div>
  );
}