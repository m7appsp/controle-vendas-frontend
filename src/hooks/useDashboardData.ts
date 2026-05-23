import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const normalizarTexto = (texto: string = "") => 
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const mapearServicoParaGrupo = (servico: string) => {
  const s = normalizarTexto(servico);
  if (["pos titular", "controle", "migra pos", "migra controle"].includes(s)) return "pos_total";
  if (["virtua", "tv box", "tv trade"].includes(s)) return "residencial";
  if (s === "aparelho") return "aparelho";
  if (s === "acessorios") return "acessorios";
  return "outros";
};

export function useDashboardData(mes: number, ano: number, diaSelecionado: Date) {
  const [dados, setDados] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
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

      /* ========================================================
         FILTRAR ATÉ O DIA SELECIONADO (Nova Regra de Negócio)
      ======================================================== */
      const limiteDataCorte = new Date(diaSelecionado);
      limiteDataCorte.setHours(23, 59, 59, 999); // Garante que pega o dia selecionado inteiro

      const vendasFiltradasAcumuladas = vendas.filter((v: any) => {
        if (!v.data) return false;
        
        const dataVenda = new Date(v.data);
        const partes = v.data.split("-");
        const anoVenda = Number(partes[0]);
        const mesVenda = Number(partes[1]);

        // 1. Deve ser do mesmo mês e ano selecionados no calendário
        const mesmoMesAno = mesVenda === mes && anoVenda === ano;
        
        // 2. A data da venda deve ser menor ou igual ao dia limite clicado
        const ateODiaSelecionado = dataVenda <= limiteDataCorte;

        return mesmoMesAno && ateODiaSelecionado;
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
         ACUMULADORES (Até o Dia Selecionado)
      ====================== */
      let receitaTotal = 0;
      let pos = 0;
      let residential = 0;
      let aparelhos = 0;
      let acessorios = 0;

      const servicosMap: Record<string, number> = {};
      const diasMap: Record<string, number> = {};

      /* ======================
         PROCESSAR VENDAS FILTRADAS
      ====================== */
      vendasFiltradasAcumuladas.forEach((v: any) => {
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
        ? { data: diasOrdenados[0][0], valor: Number(diasOrdenados[0][1]) }
        : null;

      const piorDia = diasOrdenados.length
        ? { data: diasOrdenados[diasOrdenados.length - 1][0], valor: Number(diasOrdenados[diasOrdenados.length - 1][1]) }
        : null;

      /* ======================
         TICKET MÉDIO
      ====================== */
      const ticketMedio = vendasFiltradasAcumuladas.length > 0 ? receitaTotal / vendasFiltradasAcumuladas.length : 0;

      /* =============================================================
         METAS, PROJEÇÕES E RITMO COM BASE NO DIA SELECIONADO
      ============================================================= */
      const diaCorte = diaSelecionado.getDate();
      const diasNoMes = new Date(ano, mes, 0).getDate();
      
      // Média diária calculada com base em quantos dias se passaram até o dia selecionado
      const media = receitaTotal / Math.max(diaCorte, 1);
      const projecaoFinal = media * diasNoMes;
      
      const falta = metaReceita - receitaTotal;
      const diasRestantes = Math.max(diasNoMes - diaCorte, 1);

      const metaDia = falta > 0 ? Math.floor(falta / diasRestantes) : 0;
      const vaiBaterMeta = projecaoFinal >= metaReceita;

      /* ========================================================
         CÁLCULO DA NECESSIDADE DIÁRIA EVOLUTIVA
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
         INSIGHTS REATIVOS
      ===================== */
      const insights = [];
      if (projecaoFinal >= metaReceita) {
        insights.push({ tipo: "positivo", mensagem: `No ritmo até o dia ${diaCorte}, você atingirá a meta mensal.` });
      } else {
        insights.push({ tipo: "alerta", mensagem: `O ritmo acumulado até o dia ${diaCorte} está abaixo do ideal para o mês.` });
      }

      if (ticketMedio < 150) {
        insights.push({ tipo: "negativo", mensagem: "Ticket médio do período abaixo do ideal. Priorize vendas de maior valor." });
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
        necessidadePos,
        necessidadeResidencial,
        necessidadeAparelhos,
        necessidadeAcessorios,
        insights,
        vendasIndividuais: vendas, // Retorna todas as vendas para o filtro do dia específico funcionar no card branco

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
  }, [mes, ano, diaSelecionado]); // Agora reage instantaneamente ao clique de qualquer dia!

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { ...dados, loading, erro, atualizarDados: carregar };
}