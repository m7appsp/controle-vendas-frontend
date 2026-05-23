import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface DistribuicaoProps {
  pos: number;
  residencial: number;
  aparelhos: number;
  acessorios: number;
}

export default function DistribuicaoReceita({
  pos,
  residencial,
  aparelhos,
  acessorios,
}: DistribuicaoProps) {
  const total = pos + residencial + aparelhos + acessorios;

  // Atualizado com a paleta exata do exemplo de referência de vidro:
  // Tons de azul elétrico, ciano neon, roxo profundo e detalhes dourados/metálicos
  const data = [
    { name: "Pós Total", value: pos, color: "#00d2ff" },       // Ciano Elétrico
    { name: "Residencial", value: residencial, color: "#d4af37" }, // Ouro/Metalizado
    { name: "Aparelhos", value: aparelhos, color: "#2563eb" },   // Azul Royal
    { name: "Acessórios", value: acessorios, color: "#a855f7" },  // Roxo Neon
  ];

  const calcPct = (v: number) =>
    total === 0 ? 0 : ((v / total) * 100).toFixed(0);

  return (
    <div className="h-full w-full flex flex-col justify-between min-h-[250px]">
      
      {/* ATUALIZADO: TÍTULO PADRONIZADO COM O APP (Sem duplicidade) */}
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-200 tracking-tight">
          Distribuição de Receitas
        </h3>
        <p className="text-[11px] text-slate-500 font-medium">Participação por segmento comercial</p>
      </div>

      {/* ÁREA CENTRAL DO GRÁFICO E LEGENDA */}
      <div className="flex flex-1 items-center justify-center gap-8">
        
        {/* CONTAINER DO ANEL FLUTUANTE */}
        <div className="w-[180px] h-[180px] relative flex items-center justify-center shrink-0">
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={62}
                outerRadius={80}
                dataKey="value"
                stroke="none"
                paddingAngle={3} // Pequeno espaçamento premium entre as fatias
              >
                {data.map((item, i) => (
                  <Cell 
                    key={i} 
                    fill={item.color} 
                    style={{
                      filter: `drop-shadow(0px 0px 8px ${item.color}50)` // Cria o efeito de neon aceso igual ao mockup
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* TEXTO CORAÇÃO DO ANEL (Mete o valor total e dá profundidade ao widget) */}
          <div className="absolute text-center flex flex-col items-center justify-center select-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Total
            </span>
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              {total}
            </span>
          </div>
        </div>

        {/* LEGENDA PREMIUM POLIDA */}
        <div className="flex-1 space-y-3 max-w-[200px]">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                {/* Marcador redondo com sombra projetada na cor do segmento */}
                <span
                  className="w-2.5 h-2.5 rounded-full block border border-white/10 transition-transform group-hover:scale-110"
                  style={{ 
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}80`
                  }}
                />
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {item.name}
                </span>
              </div>

              <span className="text-xs font-bold text-slate-300 bg-white/5 border border-white/5 rounded-md px-1.5 py-0.5 min-w-[38px] text-center drop-shadow-sm">
                {calcPct(item.value)}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}