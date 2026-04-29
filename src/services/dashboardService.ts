export type Venda = {
  nome: string;
  categoria: 'pos' | 'residencial' | 'avancado';
  quantidade: number;
  valor: number;
};

const vendas: Venda[] = [
  { nome: 'Pos Titular', categoria: 'pos', quantidade: 40, valor: 129.9 },
  { nome: 'Controle', categoria: 'pos', quantidade: 30, valor: 99.9 },
  { nome: 'Migra Pós', categoria: 'pos', quantidade: 25, valor: 139.9 },
  { nome: 'Banda Larga Movel', categoria: 'pos', quantidade: 25, valor: 89.9 },

  { nome: 'Virtua', categoria: 'residencial', quantidade: 20, valor: 119.9 },
  { nome: 'Tv Box', categoria: 'residencial', quantidade: 15, valor: 79.9 },
  { nome: 'Tv Trade', categoria: 'residencial', quantidade: 10, valor: 59.9 },

  { nome: 'Upgrade', categoria: 'avancado', quantidade: 8, valor: 49.9 },
  { nome: 'Wifi Mesh', categoria: 'avancado', quantidade: 6, valor: 199.9 },
  { nome: 'Trocafy', categoria: 'avancado', quantidade: 4, valor: 29.9 },
];

export function obterResumoDashboard() {
  const receitaTotal = vendas.reduce(
    (total, v) => total + v.quantidade * v.valor,
    0
  );

  const posTotal = vendas
    .filter(v => v.categoria === 'pos')
    .reduce((s, v) => s + v.quantidade, 0);

  const residencial = vendas
    .filter(v => v.categoria === 'residencial')
    .reduce((s, v) => s + v.quantidade, 0);

  const avancado = vendas
    .filter(v => v.categoria === 'avancado')
    .reduce((s, v) => s + v.quantidade, 0);

  return {
    receitaTotal,
    posTotal,
    residencial,
    avancado,
  };
}