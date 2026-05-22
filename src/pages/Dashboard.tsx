import { useState } from "react";
import {
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  Headphones,
  ChevronLeft,
  ChevronRight,
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
    mejorDia, // mantido conforme o hook original do usuário
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

  /* ========================================================
      FILTRO REATIVO DIRETO (Seguro contra erros de Hook)
     ======================================================== */
  const vendasDoDia =
    vendasIndividuais?.filter((v: any) => {
      if (!v || !v.data) return false;

      const dataStr = typeof v.data === "string" ? v.data : new Date(v.data).toISOString();
      const apenasDataVenda = dataStr.split("T")[0]; 

      const ano = diaSelecionado.getFullYear();
      const mes = String(diaSelecionado.getMonth() + 1).padStart(2, "0");
      const dia = String(diaSelecionado.getDate()).padStart(2, "0");
      const apenasDataCalendario = `${ano}-${mes}-${dia}`;

      return apenasDataVenda === apenasDataCalendario;
    }) || [];

  // Calcula a soma em tempo de renderização (zera automaticamente se deletado ou sem vendas)
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
        
        {/* 1. DISTRIBUIÇÃO RECEITA */}
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
        <div className="bg-white text-black rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex flex-col justify-between select-none border border-slate-100/80">
          <div>
            <div className="flex justify-between items-start w-full text-black font-bold">
              <div className="flex items-center gap-2 text-sm tracking-wide font-semibold text-slate-900">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                DIA SELECIONADO
              </div>
              <div className="text-right leading-tight flex flex-col items-end">
                <p className="text-xl font-normal text-slate-900 capitalize">
                  {diaSelecionado.toLocaleDateString("pt-BR", { month: "long" })}
                </p>
                <p className="text-base font-normal text-slate-500 capitalize mt-0.5">
                  {diaSelecionado.toLocaleDateString("pt-BR", { weekday: "long" })}
                </p>
              </div>
            </div>

            <h2 className="text-6xl font-bold text-black tracking-tight leading-none mt-2">
              {diaSelecionado.getDate()}
            </h2>
          </div>

          {/* RECEITA DO DIA ATUALIZADA */}
          <div className="my-5 bg-gradient-to-br from-[#0a1c3a] via-[#103a7d] to-[#1d4ed8] rounded-2xl p-4 text-white shadow-[0_12px_24px_rgba(16,58,125,0.25)] border-[2.5px] border-[#d4af37]/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform translate-x-4 skew-x-12 pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10">
              <p className="text-xs font-bold tracking-wide text-slate-200/90">
                RECEITA DO DIA
              </p>
              <span className="text-[10px] font-normal text-slate-300/80 tracking-tight">Meta diária</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-2 relative z-10">
              <h3 className="text-2xl font-bold tracking-tight text-white">{formatMoeda(receitaDia)}</h3>
              <p className="font-bold text-base text-white">{formatMoeda(metaDia)}</p>
            </div>
          </div>

          {/* GRID DE NECESSIDADES */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white rounded-2xl p-4 shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between min-h-[85px]">
              <p className="text-sm font-medium text-slate-700">Pós</p>
              <div className="mt-1">
                <h4 className="text-2xl font-bold text-black leading-none">{necessidadePos}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-normal">necessário/dia</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between min-h-[85px]">
              <p className="text-sm font-medium text-slate-700">Residencial</p>
              <div className="mt-1">
                <h4 className="text-2xl font-bold text-black leading-none">{necessidadeResidencial}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-normal">necessário/dia</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between min-h-[85px]">
              <p className="text-sm font-medium text-slate-700">Aparelhos</p>
              <div className="mt-1">
                <h4 className="text-2xl font-bold text-black leading-none">{necessidadeAparelhos}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-normal">necessário/dia</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between min-h-[85px]">
              <p className="text-sm font-medium text-slate-700">Acessórios</p>
              <div className="mt-1">
                <h4 className="text-2xl font-bold text-black leading-none">{necessidadeAcessorios}</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-normal">necessário/dia</p>
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
        <InsightsInteligentes insights={insights} mejorDia={mejorDia} piorDia={piorDia} ticketMedio={ticketMedio} rankingServicos={rankingServicos} />
      </div>

    </div>
  );
}