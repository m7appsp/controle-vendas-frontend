export interface Venda {
  id: string;
  produto: string;
  valor: number;
  categoria: string;
  data: string;
  clienteNome: string;
  clienteCpf?: string;
}