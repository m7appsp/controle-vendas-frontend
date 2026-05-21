import { useState } from "react";
import {
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  Headphones,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  getDate,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";

import { formatMoeda } from "../utils/format";
import { useDashboardData } from "../hooks/useDashboardData";

import StatCard from "../components/ui/StatCard";
import DistribuicaoReceita from "../components/DistribuicaoReceita";
import ComparativoMensalChart from "../components/ComparativoMensalChart";
import MetaInsight from "../components/MetaInsight";
import InsightsInteligentes from "../components/InsightsInteligentes";

export default function Dashboard() {
  const hojeBrasil = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Sao_Paulo",
    })
  );

  const [diaSelecionado, setDiaSelecionado] = useState<Date>(hojeBrasil);
  const [dataCalendario, setDataCalendario] = useState<Date>(hojeBrasil);

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

    necessidadePos,
    necessidadeResidencial,
    necessidadeAparelhos,
    necessidadeAcessorios,

    insights,
    melhorDia,
    piorDia,
    ticketMedio,
    rankingServicos,

    loading,
    erro,
  } = useDashboardData(
    dataCalendario.getMonth() + 1,
    dataCalendario.getFullYear(),
    diaSelecionado
  );

  /* ========================================================
      FUNÇÕES DE NAVEGAÇÃO DO MÊS
     ======================================================== */
  const voltarMes = () => {
    setDataCalendario((prev) => subMonths(prev, 1));
  };

  const avancarMes = () => {
    setDataCalendario((prev) => addMonths(prev, 1));
  };

  /* ========================================================
      GERAÇÃO DO CALENDÁRIO COM DATE-FNS
     ======================================================== */
  const inicioDoMes = startOfMonth(dataCalendario);
  const fimDoMes = endOfMonth(dataCalendario);
  
  const diasDoMes = eachDayOfInterval({ start: inicioDoMes, end: fimDoMes });
  const diaSemanaInicio = getDay(inicioDoMes);
  const espacosVazios = Array.from({ length: diaSemanaInicio });

  const diasDaSemanaLabels = ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sá"];

  const textoMesAnoCalendario = dataCalendario.toLocaleDateString("pt-BR", { 
    month: "long", 
    year: "numeric" 
  });

  if (loading) {
    return <div className="p-6 text-white bg-[#02040a] min-h-screen flex items-center justify-center font-sans">Carregando...</div>;
  }

  if (erro) {
    return <div className="p-6 text-red-500 bg-[#02040a] min-h-screen flex items-center justify-center font-sans">{erro}</div>;
  }

  /* ======================
      FILTRO DIA SELECIONADO
  ====================== */
  const vendasDoDia =
    vendasIndividuais?.filter((v: any) => {
      const dataVenda = new Date(v.data + "T12:00:00");
      return (
        dataVenda.getDate() === diaSelecionado.getDate() &&
        dataVenda.getMonth() === diaSelecionado.getMonth() &&
        dataVenda.getFullYear() === diaSelecionado.getFullYear()
      );
    }) || [];

  const receitaDia = vendasDoDia.reduce(
    (acc: number, v: any) => acc + Number(v.receita || 0),
    0
  );

  return (
    <div className="w-full min-h-screen bg-[#02040a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#081329] via-[#02050f] to-[#010307] text-white overflow-x-hidden p-8 space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Painel de Análise
        </h1>
        <p className="text-sm text-blue-400/80 font-medium mt-1">
          Resumo Comercial •{" "}
          <span className="capitalize">{textoMesAnoCalendario}</span>
        </p>
      </div>

      {/* CARDS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard title="Receita Total" value={formatMoeda(receitaTotal)} icon={<Wallet />} meta={metaReceita} realizado={receitaTotal} />
        <StatCard title="Pós" value={pos} icon={<Smartphone />} meta={120} realizado={pos} />
        <StatCard title="Residencial" value={residencial} icon={<Wifi />} meta={80} realizado={residencial} />
        <StatCard title="Aparelhos" value={aparelhos} icon={<MonitorSmartphone />} meta={40} realizado={aparelhos} />
        <StatCard title="Acessórios" value={acessorios} icon={<Headphones />} meta={60} realizado={acessorios} />
      </div>

      {/* BLOCO CENTRAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 1. DISTRIBUIÇÃO RECEITA - Sem título externo duplicado */}
        <div className="bg-gradient-to-b from-[#0b1329]/70 to-[#040814]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center">
            <DistribuicaoReceita pos={pos} residencial={residencial} aparelhos={aparelhos} acessorios={acessorios} />
          </div>
        </div>

        {/* 2. CALENDÁRIO */}
        <div className="bg-gradient-to-b from-[#0b1329]/70 to-[#040814]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col justify-between min-h-[320px] shadow-xl relative select-none">
          <div className="flex justify-between items-center w-full px-2 mb-4">
            <h3 className="text-base font-bold text-slate-200 tracking-wide capitalize">
              {textoMesAnoCalendario}
            </h3>
            <div className="flex gap-4 text-slate-400">
              <button type="button" onClick={voltarMes} className="hover:text-white transition-colors p-1">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={avancarMes} className="hover:text-white transition-colors p-1">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-500 mb-3">
              {diasDaSemanaLabels.map((d, index) => (
                <div key={`label-${index}`}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2.5 text-center items-center justify-items-center">
              {espacosVazios.map((_, index) => (
                <div key={`vazio-${index}`} className="w-9 h-9" />
              ))}

              {diasDoMes.map((dataDia) => {
                const numeroDia = getDate(dataDia);
                const isSelecionado = isSameDay(dataDia, diaSelecionado);
                const isHoje = isSameDay(dataDia, hojeBrasil);

                return (
                  <button
                    key={dataDia.toString()}
                    type="button"
                    onClick={() => setDiaSelecionado(dataDia)}
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm outline-none select-none
                      ${isSelecionado 
                        ? "bg-[#2563eb] text-white shadow-[0_0_12px_rgba(37,99,235,0.8)] font-bold" 
                        : isHoje
                        ? "text-cyan-400 border border-cyan-400/30 font-bold"
                        : "text-slate-400 hover:text-white"
                      }
                    `}
                  >
                    {numeroDia}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. CARD DIA SELECIONADO */}
        <div className="bg-[#ffffff] text-slate-900 rounded-[24px] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col justify-between select-none border border-slate-100">
          <div>
            <div className="flex justify-between items-center w-full text-slate-400 font-bold text-[11px] tracking-wide">
              <div className="flex items-center gap-1.5 uppercase">
                <CalendarDays size={13} className="text-slate-400" />
                DIA SELECIONADO
              </div>
              <div className="text-right leading-tight">
                <p className="text-sm font-extrabold text-slate-900 capitalize">
                  {diaSelecionado.toLocaleDateString("pt-BR", { month: "long" })}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold capitalize">
                  {diaSelecionado.toLocaleDateString("pt-BR", { weekday: "long" })}
                </p>
              </div>
            </div>

            <h2 className="text-[64px] font-black text-slate-950 tracking-tighter leading-none mt-2">
              {diaSelecionado.getDate()}
            </h2>
          </div>

          {/* RECEITA DO DIA */}
          <div className="my-5 bg-gradient-to-b from-[#1b5ecf] via-[#1a59c5] to-[#0f3ea2] rounded-[18px] p-4 text-white shadow-[0_10px_20px_rgba(27,94,207,0.25)] border-t border-b border-amber-300/40 relative overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
            
            <div className="flex justify-between items-center">
              <p className="text-[9px] uppercase font-black tracking-widest text-blue-100/90">
                RECEITA DO DIA
              </p>
              <span className="text-[8px] uppercase font-bold text-blue-200/60 tracking-tight">Meta diária</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-[26px] font-black tracking-tight text-white">{formatMoeda(receitaDia)}</h3>
              <p className="font-extrabold text-xs text-white/90">{formatMoeda(metaDia)}</p>
            </div>
          </div>

          {/* GRID DE NECESSIDADES */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-[14px] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
              <p className="text-[11px] text-slate-800 font-extrabold">Pós</p>
              <div className="mt-1">
                <h4 className="text-[22px] font-black text-slate-950 leading-none">{necessidadePos}</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-1.5">necessidade</p>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
              <p className="text-[11px] text-slate-800 font-extrabold">Residencial</p>
              <div className="mt-1">
                <h4 className="text-[22px] font-black text-slate-950 leading-none">{necessidadeResidencial}</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-1.5">necessidade</p>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
              <p className="text-[11px] text-slate-800 font-extrabold">Aparelhos</p>
              <div className="mt-1">
                <h4 className="text-[22px] font-black text-slate-950 leading-none">{necessidadeAparelhos}</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-1.5">necessidade</p>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between">
              <p className="text-[11px] text-slate-800 font-extrabold">Acessórios</p>
              <div className="mt-1">
                <h4 className="text-[22px] font-black text-slate-950 leading-none">{necessidadeAcessorios}</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-1.5">necessidade</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* COMPARATIVO + META INSIGHT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gradient-to-b from-[#0b1329]/70 to-[#040814]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 min-h-[350px] shadow-xl">
          <ComparativoMensalChart atual={receitaTotal} passado={receitaTotal * 0.82} />
        </div>

        <div className="bg-gradient-to-b from-[#0b1329]/70 to-[#040814]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl">
          <MetaInsight meta={metaReceita} projecao={projecaoFinal} diaria={metaDia} status={vaiBaterMeta} />
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="bg-gradient-to-b from-[#0b1329]/50 to-[#040814]/70 backdrop-blur-md rounded-3xl border border-white/5 p-2 shadow-xl">
        <InsightsInteligentes insights={insights} melhorDia={melhorDia} piorDia={piorDia} ticketMedio={ticketMedio} rankingServicos={rankingServicos} />
      </div>

    </div>
  );
}