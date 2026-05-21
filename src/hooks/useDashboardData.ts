import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const normalizarTexto = (texto: string = "") =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const mapearServicoParaGrupo = (servico: string) => {
  const s = normalizarTexto(servico);

  if (
    [
      "pos titular",
      "controle",
      "migra pos",
      "migra controle",
    ].includes(s)
  )
    return "pos_total";

  if (["virtua", "tv box", "tv trade"].includes(s))
    return "residencial";

  if (s === "aparelho") return "aparelho";

  if (s === "acessorios") return "acessorios";

  return "outros";
};

export function useDashboardData(
  mes: number,
  ano: number,
  diaSelecionado?: Date
) {
  const [dados, setDados] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        setErro("");

        /* ======================
           BUSCAR VENDAS
        ====================== */
        const { data, error } = await supabase
          .from("vendas_individuais")
          .select("*")
          .order("data", { ascending: false });

        if (error) {
          setErro(error.message);
          return;
        }

        const vendas = data || [];

        /* ======================
           FILTRAR MÊS/ANO
        ====================== */
        const vendasMes = vendas.filter((v: any) => {
          if (!v.data) return false;

          const partes = v.data.split("-");
          const anoVenda = Number(partes[0]);
          const mesVenda = Number(partes[1]);

          return mesVenda === mes && anoVenda === ano;
        });

        /* ======================
           BUSCAR METAS
        ====================== */
        const { data: metasData } = await supabase
          .from("metas")
          .select("*")
          .eq("mes", mes)
          .eq("ano", ano);

        const getMeta = (servico: string) =>
          metasData?.find((m: any) => m.servico === servico)?.valor_meta || 0;

        const metaReceita = getMeta("receita_total");

        /* ======================
           ACUMULADORES
        ====================== */
        let receitaTotal = 0;
        let pos = 0;
        let residential = 0;
        let aparelhos = 0;
        let acessorios = 0;

        const servicosMap: Record<string, number> = {};
        const diasMap: Record<string, number> = {};

        /* ======================
           PROCESSAR VENDAS
        ====================== */
        vendasMes.forEach((v: any) => {
          const receita = Number(v.receita || 0);
          const quantidade = Number(v.quantidade || 0);

          receitaTotal += receita;

          const grupo = mapearServicoParaGrupo(v.servico);

          if (grupo === "pos_total") pos += quantidade;
          if (grupo === "residencial") residential += quantidade;
          if (grupo === "aparelho") aparelhos += quantidade;
          if (grupo === "acessorios") acessorios += quantidade;

          /* ranking */
          servicosMap[v.servico] = (servicosMap[v.servico] || 0) + quantidade;

          /* receita por dia */
          const dia = new Date(v.data).toLocaleDateString("pt-BR");
          diasMap[dia] = (diasMap[dia] || 0) + receita;
        });

        /* ======================
           RANKING SERVIÇOS
        ====================== */
        const rankingServicos = Object.entries(servicosMap)
          .map(([nome, total]) => ({
            nome,
            total: Number(total),
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        /* ======================
           MELHOR / PIOR DIA
        ====================== */
        const diasOrdenados = Object.entries(diasMap).sort(
          (a, b) => Number(b[1]) - Number(a[1])
        );

        const melhorDia = diasOrdenados.length
          ? {
              data: diasOrdenados[0][0],
              valor: Number(diasOrdenados[0][1]),
            }
          : null;

        const piorDia = diasOrdenados.length
          ? {
              data: diasOrdenados[diasOrdenados.length - 1][0],
              valor: Number(diasOrdenados[diasOrdenados.length - 1][1]),
            }
          : null;

        /* ======================
           TICKET MÉDIO
        ====================== */
        const ticketMedio =
          vendasMes.length > 0 ? receitaTotal / vendasMes.length : 0;

        /* ======================
           META / PROJEÇÃO (CORRIGIDO FUSO HORÁRIO)
        ====================== */
        const hojeBrasil = new Date(
          new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
        );

        const diaAtual = hojeBrasil.getDate();

        const diasNoMes = new Date(ano, mes, 0).getDate();

        const media = receitaTotal / Math.max(diaAtual, 1);

        const projecaoFinal = media * diasNoMes;

        const falta = metaReceita - receitaTotal;

        const diasRestantes = Math.max(diasNoMes - diaAtual, 1);

        const metaDia = falta > 0 ? Math.floor(falta / diasRestantes) : 0;

        const vaiBaterMeta = projecaoFinal >= metaReceita;

        /* ========================================================
           CÁLCULO DA NECESSIDADE DIÁRIA POR CATEGORIA (NOVO)
        ======================================================== */
        const metaPos = getMeta("pos_total");
        const metaResidencial = getMeta("residencial");
        const metaAparelhos = getMeta("aparelho");
        const metaAcessorios = getMeta("acessorios");

        const necessidadePos = Math.max(0, Math.ceil((metaPos - pos) / diasRestantes));
        const necessidadeResidencial = Math.max(0, Math.ceil((metaResidencial - residential) / diasRestantes));
        const necessidadeAparelhos = Math.max(0, Math.ceil((metaAparelhos - aparelhos) / diasRestantes));
        const necessidadeAcessorios = Math.max(0, Math.ceil((metaAcessorios - acessorios) / diasRestantes));

        /* ======================
           INSIGHTS
        ====================== */
        const insights = [];

        if (projecaoFinal >= metaReceita) {
          insights.push({
            tipo: "positivo",
            mensagem: "Você está no caminho para bater a meta.",
          });
        } else {
          insights.push({
            tipo: "alerta",
            mensagem: "Ritmo atual abaixo do necessário para atingir a meta.",
          });
        }

        if (ticketMedio < 150) {
          insights.push({
            tipo: "negativo",
            mensagem: "Ticket médio abaixo do ideal. Priorize vendas de maior valor.",
          });
        }

        /* ======================
           SET FINAL
        ====================== */
        setDados({
          receitaTotal,
          pos,
          residencial: residential,
          aparelhos,
          acessorios,

          metaReceita,
          projecaoFinal,
          metaDia,
          vaiBaterMeta,

          // Novos dados acoplados ao retorno
          necessidadePos,
          necessidadeResidencial,
          necessidadeAparelhos,
          necessidadeAcessorios,

          insights,
          vendasIndividuais: vendasMes,

          melhorDia,
          piorDia,
          ticketMedio,
          rankingServicos,
        });
      } catch (err: any) {
        console.error(err);
        setErro("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [mes, ano, diaSelecionado]);

  return {
    ...dados,
    loading,
    erro,
  };
}