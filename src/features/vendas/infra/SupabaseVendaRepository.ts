import type { Venda } from "../domain/Venda";
import type { VendaRepository } from "../domain/VendaRepository";
import { supabase } from "../../../lib/supabase";

export class SupabaseVendaRepository implements VendaRepository {
  async listar(): Promise<Venda[]> {
    const { data, error } = await supabase
      .from("vendas")
      .select("*")
      .order("data", { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map((v: any) => ({
      id: v.id,
      produto: v.produto,
      valor: Number(v.valor),
      data: v.data,
      clienteNome: v.cliente_nome,
      clienteCpf: v.cliente_cpf || undefined,
    }));
  }

 async criar(venda: Venda): Promise<void> {
  const { data, error } = await supabase
    .from("vendas")
    .insert({
      id: venda.id,
      produto: venda.produto,
      valor: venda.valor,
      data: venda.data,
      cliente_nome: venda.clienteNome,
      cliente_cpf: venda.clienteCpf ?? null,
    })
    .select();

  if (error) {
    console.error("ERRO AO INSERIR VENDA NO SUPABASE:", error);
    throw error;
  }

  console.log("VENDA INSERIDA COM SUCESSO:", data);
}


  async remover(id: string): Promise<void> {
    const { error } = await supabase
      .from("vendas")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}