export interface Venda {
  id: string
  produto: string
  valor: number
  data: string
  clienteNome: string
  clienteCpf?: string
}