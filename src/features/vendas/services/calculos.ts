import type { Venda } from "../domain/Venda";

/* =========================
   RECEITAS
========================= */

export function receitaHoje(vendas: Venda[]) {
  const hoje = new Date().toISOString().slice(0, 10);
  return vendas
    .filter(v => v.data.startsWith(hoje))
    .reduce((s, v) => s + v.valor, 0);
}

export function receitaSemana(vendas: Venda[]) {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  return vendas
    .filter(v => new Date(v.data) >= inicioSemana)
    .reduce((s, v) => s + v.valor, 0);
}

export function receitaMes(vendas: Venda[]) {
  const agora = new Date();
  return vendas
    .filter(v => {
      const d = new Date(v.data);
      return (
        d.getMonth() === agora.getMonth() &&
        d.getFullYear() === agora.getFullYear()
      );
    })
    .reduce((s, v) => s + v.valor, 0);
}

export function receitaAno(vendas: Venda[]) {
  const ano = new Date().getFullYear();
  return vendas
    .filter(v => new Date(v.data).getFullYear() === ano)
    .reduce((s, v) => s + v.valor, 0);
}

/* =========================
   CRESCIMENTO MENSAL (%)
========================= */

export function crescimentoMensal(vendas: Venda[]) {
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  let atual = 0;
  let anterior = 0;

  vendas.forEach(v => {
    const d = new Date(v.data);

    if (d.getMonth() === mesAtual && d.getFullYear() === anoAtual) {
      atual += v.valor;
    }

    if (d.getMonth() === mesAtual - 1 && d.getFullYear() === anoAtual) {
      anterior += v.valor;
    }
  });

  if (anterior === 0) return 100;
  return ((atual - anterior) / anterior) * 100;
}

/* =========================
   CLIENTES
========================= */

export function clientesUnicos(vendas: Venda[]) {
  return new Set(
    vendas.map(v => v.clienteCpf || v.clienteNome)
  ).size;
}
