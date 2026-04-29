import { Venda } from '../domain/Venda'
import { VendaRepository } from '../domain/VendaRepository'

const STORAGE_KEY = 'vendas'

export class LocalVendaRepository implements VendaRepository {
  async listar(): Promise<Venda[]> {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  async criar(venda: Venda): Promise<void> {
    const vendas = await this.listar()
    vendas.push(venda)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendas))
  }

  async remover(id: string): Promise<void> {
    const vendas = await this.listar()
    const filtradas = vendas.filter(v => v.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas))
  }
}
