import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const normalizarTexto = (texto: string = "") =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const mapearServicoParaGrupo = (servico: string) => {
  const s = normalizarTexto(servico);
  if (["pos titular", "controle", "migra pos", "migra controle"].includes(s))
    return "pos";
  if (["virtua", "tv box", "tv trade"].includes(s)) return "residencial";
  if (s === "aparelho") return "aparelhos";
  if (s === "acessorios") return "acessorios";
  return "outros";
};

export function useDashboardData(mes: number, ano: number, diaSelecionado?: Date) {
  const [dados, setDados] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from("vendas_individuais")
        .select("*");

      const hoje = diaSelecionado ?? new Date();

      const vendasDia = data.filter((v: any) => {
        const d = new Date(v.data);
        return d.toDateString() === hoje.toDateString();
      });

      const vendasMes = data.filter((v: any) => {
        const d = new Date(v.data);
        return d.getMonth() === mes - 1 && d.getFullYear() === ano;
      });

      const receitaDia = vendasDia.reduce(
        (s: number, v: any) => s + Number(v.receita || 0),
        0
      );

      const receitaMes = vendasMes.reduce(
        (s: number, v: any) => s + Number(v.receita || 0),
        0
      );

      const diasDecorridos = hoje.getDate();
      const mediaDiariaMes = receitaMes / Math.max(diasDecorridos, 1);

      const insights: any[] = [];

      if (receitaDia > mediaDiariaMes) {
        insights.push({
          tipo: "positivo",
          mensagem: "Hoje você está acima da média diária do mês.",
        });
      } else {
        insights.push({
          tipo: "alerta",
          mensagem:
            "Hoje o ritmo de vendas está abaixo da média diária do mês.",
        });
      }

      const categorias = ["pos", "residencial", "aparelhos", "acessorios"];

      categorias.forEach((cat) => {
        const diaCat = vendasDia.filter(
          (v: any) => mapearServicoParaGrupo(v.servico) === cat
        ).length;

        const mesCat =
          vendasMes.filter(
            (v: any) => mapearServicoParaGrupo(v.servico) === cat
          ).length / Math.max(diasDecorridos, 1);

        if (diaCat < mesCat) {
          insights.push({
            tipo: "negativo",
            mensagem: `${cat.toUpperCase()} está abaixo da média do mês.`,
          });
        }
      });

      setDados({
        vendasIndividuais: data,
        receitaDia,
        receitaMes,
        insights,
      });

      setLoading(false);
    };

    carregar();
  }, [mes, ano, diaSelecionado]);

  return { ...dados, loading };
}