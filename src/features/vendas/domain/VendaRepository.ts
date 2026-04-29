import type { Venda } from "./Venda";

export interface VendaRepository {
  listar(): Promise<Venda[]>;
  criar(venda: Venda): Promise<void>;
  remover(id: string): Promise<void>;
}