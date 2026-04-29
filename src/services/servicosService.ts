export type ServicoProduto = {
  id: number;
  nome: string;
  tipo: 'Servico' | 'Produto';
  categoria: 'Pos' | 'Residencial' | 'Avancado' | 'Produto';
  valor: number;
};

export const servicos: ServicoProduto[] = [
  // POS
  { id: 1, nome: 'Pos Titular', tipo: 'Servico', categoria: 'Pos', valor: 129.9 },
  { id: 2, nome: 'Controle', tipo: 'Servico', categoria: 'Pos', valor: 99.9 },
  { id: 3, nome: 'Migra Pos', tipo: 'Servico', categoria: 'Pos', valor: 139.9 },
  { id: 4, nome: 'Migra Controle', tipo: 'Servico', categoria: 'Pos', valor: 109.9 },
  { id: 5, nome: 'Banda Larga Movel', tipo: 'Servico', categoria: 'Pos', valor: 89.9 },

  // RESIDENCIAL
  { id: 6, nome: 'Virtua', tipo: 'Servico', categoria: 'Residencial', valor: 119.9 },
  { id: 7, nome: 'Tv Box', tipo: 'Servico', categoria: 'Residencial', valor: 79.9 },
  { id: 8, nome: 'Tv Trade', tipo: 'Servico', categoria: 'Residencial', valor: 59.9 },

  // AVANÇADO
  { id: 9, nome: 'Upgrade', tipo: 'Servico', categoria: 'Avancado', valor: 49.9 },
  { id: 10, nome: 'Wifi Mesh', tipo: 'Servico', categoria: 'Avancado', valor: 199.9 },
  { id: 11, nome: 'Trocafy', tipo: 'Servico', categoria: 'Avancado', valor: 29.9 },

  // PRODUTOS
  { id: 12, nome: 'Aparelho', tipo: 'Produto', categoria: 'Produto', valor: 899.9 },
  { id: 13, nome: 'Acessorio', tipo: 'Produto', categoria: 'Produto', valor: 99.9 },
];
``