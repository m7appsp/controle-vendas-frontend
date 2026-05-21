import { Trophy, TrendingDown, DollarSign, Target, AlertTriangle, Sparkles } from "lucide-react";

interface ServiceItem {
  nome: string;
  quantidade: number;
}

interface InsightsProps {
  insights: string[];
  melhorDia: { data: string; valor: number } | null;
  piorDia: { data: string; valor: number } | null;
  ticketMedio: number;
  rankingServicos: ServiceItem[];
}

export default function InsightsInteligentes({
  melhorDia,
  piorDia,
  ticketMedio,
  rankingServicos,
}: InsightsProps) {
  
  // Função auxiliar para formatar os valores em Moeda Real (R$)
  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Encontra o valor máximo do ranking para calcular a proporção exata das barras
  const maxQuantidade = rankingServicos && rankingServicos.length > 0 
    ? Math.max(...rankingServicos.map(s => s.quantidade)) 
    : 1;

  return (
    <div className="w-full bg-[#070a13]/90 border border-white/5 rounded-3xl p-6 font-sans select-none shadow-2xl">
      
      {/* HEADER DO BLOCO */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          Insights Inteligentes
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Performance comercial e alertas automáticos
        </p>
      </div>

      {/* 1. ROW DE CARTÕES SUPERIORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Melhor Dia */}
        <div className="bg-[#121625]/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Melhor dia</p>
              <h3 className="text-lg font-bold text-white mt-1">
                {melhorDia ? formatMoeda(melhorDia.valor) : "R$ 0,00"}
              </h3>
            </div>
            <Trophy className="text-amber-500 w-5 h-5 drop-shadow-[0_0_4px_rgba(245,158,11,0.3)]" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-3">
            {melhorDia ? melhorDia.data : "--/--/----"}
          </p>
        </div>

        {/* Pior Dia */}
        <div className="bg-[#121625]/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Pior dia</p>
              <h3 className="text-lg font-bold text-white mt-1">
                {piorDia ? formatMoeda(piorDia.valor) : "R$ 0,00"}
              </h3>
            </div>
            <TrendingDown className="text-rose-500 w-5 h-5" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-3">
            {piorDia ? piorDia.data : "--/--/----"}
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-[#121625]/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Ticket médio</p>
              <h3 className="text-lg font-bold text-white mt-1">
                {formatMoeda(ticketMedio || 0)}
              </h3>
            </div>
            <DollarSign className="text-cyan-400 w-5 h-5" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-3">por venda</p>
        </div>

        {/* Meta Diária */}
        <div className="bg-[#121625]/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Meta diária</p>
              <h3 className="text-lg font-bold text-white mt-1">R$ 0,00</h3>
            </div>
            <Target className="text-emerald-400 w-5 h-5" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-3">necessário/dia</p>
        </div>

      </div>

      {/* 2. SEÇÃO DE ALERTAS DINÂMICOS */}
      <div className="space-y-3 mb-6">
        {/* Alerta de Ritmo */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="text-amber-500 w-4 h-4 flex-shrink-0" />
          <p className="text-xs font-medium text-amber-400/90 tracking-wide">
            Ritmo atual abaixo do necessário para atingir a meta.
          </p>
        </div>

        {/* Alerta de Ticket Médio */}
        <div className="bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <TrendingDown className="text-rose-500 w-4 h-4 flex-shrink-0" />
          <p className="text-xs font-medium text-rose-400/90 tracking-wide">
            Ticket médio abaixo do ideal. Priorize vendas de maior valor.
          </p>
        </div>
      </div>

      {/* 3. PAINEL DE TOP SERVIÇOS (RANKING COM BARRAS ESPESSAS) */}
      <div className="bg-[#0b0f19]/60 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="text-cyan-400 w-4 h-4" />
          <h4 className="text-sm font-bold text-slate-200 tracking-wide">
            Top serviços vendidos
          </h4>
        </div>

        <div className="space-y-4">
          {rankingServicos?.map((servico, index) => {
            // Calcula a largura da barra proporcionalmente ao item mais vendido
            const percentualLargura = (servico.quantidade / maxQuantidade) * 100;

            return (
              <div key={index} className="flex items-center gap-4">
                
                {/* Nome do Serviço e Medalha */}
                <div className="w-[180px] flex items-center justify-between bg-[#121625]/40 border border-white/5 rounded-lg px-3 py-1.5 shadow-sm">
                  <span className="text-xs font-bold text-slate-300 truncate">
                    {servico.nome}
                  </span>
                  
                  {/* Renderização condicional das medalhas baseada na posição */}
                  {index === 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 text-[10px] font-black text-amber-950 shadow-md">
                      1º
                    </span>
                  )}
                  {index === 1 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 text-[10px] font-black text-slate-900 shadow-md">
                      2º
                    </span>
                  )}
                  {index === 2 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 text-[10px] font-black text-amber-100 shadow-md">
                      3º
                    </span>
                  )}
                </div>

                {/* Container da Barra com a espessura maior e arredondamento (h-3.5 e rounded-full) */}
                <div className="flex-1 bg-[#121625]/80 rounded-full h-3.5 overflow-hidden p-[2px] border border-white/5">
                  <div
                    className="bg-[#24a0ed] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(36,160,237,0.2)]"
                    style={{ width: `${percentualLargura}%` }}
                  />
                </div>

                {/* Quantidade numérica lateral */}
                <span className="text-xs font-bold text-slate-400 w-5 text-right">
                  {servico.quantidade}
                </span>

              </div>
            );
          })}
        </div>
      </div>

      {/* RODAPÉ INFORMATIVO */}
      <div className="mt-5 pt-3 border-t border-white/5 text-left">
        <span className="text-[10px] text-slate-500 font-medium tracking-wide">
          🔄 Atualizado com base nas vendas registradas do mês
        </span>
      </div>

    </div>
  );
}