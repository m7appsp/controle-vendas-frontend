import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const normalizarTexto = (texto: string = "") =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const mapearServicoParaGrupo = (servico: string) => {
  const s = normalizarTexto(servico);

  if (["pos titular", "controle", "migra pos", "migra controle"].includes(s))
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

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from("vendas_individuais")
        .select("*");

      const { data: metasData } = await supabase
        .from("metas")
        .select("*")
        .eq("mes", mes)
        .eq("ano", ano);

      /* ======================
         KPI MÊS
      ====================== */

      let receitaTotal = 0;
      let pos = 0;
      let residencial = 0;
      let aparelhos = 0;
      let acessorios = 0;

      data.forEach((v: any) => {
        receitaTotal += Number(v.receita || 0);

        const grupo = mapearServicoParaGrupo(v.servico);

        if (grupo === "pos_total") pos += Number(v.quantidade || 0);
        if (grupo === "residencial") residencial += Number(v.quantidade || 0);
        if (grupo === "aparelho") aparelhos += Number(v.quantidade || 0);
        if (grupo === "acessorios") acessorios += Number(v.quantidade || 0);
      });

      /* ======================
         METAS
      ====================== */

      const getMeta = (servico: string) => {
        return (
          metasData?.find((m: any) => m.servico === servico)
            ?.valor_meta || 0
        );
      };

      const metaReceita = getMeta("receita_total");

      /* ======================
         PROJEÇÃO
      ====================== */

      const hoje = new Date();
      const diaAtual = hoje.getDate();
      const diasNoMes = new Date(ano, mes, 0).getDate();

      const media = receitaTotal / Math.max(diaAtual, 1);
      const projecaoFinal = media * diasNoMes;

      const falta = metaReceita - receitaTotal;

      const metaDia =
        falta > 0 ? Math.floor(falta / (diasNoMes - diaAtual)) : 0;

      const vaiBaterMeta = projecaoFinal >= metaReceita;

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
          mensagem:
            "Ritmo atual está abaixo do necessário para atingir a meta.",
        });
      }

      /* ======================
         SET FINAL
      ====================== */

      setDados({
        receitaTotal,
        pos,
        residencial,
        aparelhos,
        acessorios,

        metaReceita,

        projecaoFinal,
        metaDia,
        vaiBaterMeta,

        insights,

        vendasIndividuais: data,
      });

      setLoading(false);
    };

    carregar();
  }, [mes, ano, diaSelecionado]);

  return { ...dados, loading };
}