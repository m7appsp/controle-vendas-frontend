import { createContext, useContext, useEffect, useState } from "react";

import type { Venda } from "../domain/Venda";
import { SupabaseVendaRepository } from "../infra/SupabaseVendaRepository";

/* =================================================
   REPOSITORY (FONTE DOS DADOS)
================================================= */

const repository = new SupabaseVendaRepository();

/* =================================================
   TIPAGEM DO CONTEXTO
================================================= */

type VendasContextType = {
  vendas: Venda[];
  adicionarVenda: (venda: Venda) => Promise<void>;
  removerVenda: (id: string) => Promise<void>;
  recarregarVendas: () => Promise<void>;
};

/* =================================================
   CONTEXTO
================================================= */

const VendasContext = createContext<VendasContextType | undefined>(undefined);

/* =================================================
   PROVIDER
================================================= */

export function VendasProvider({ children }: { children: React.ReactNode }) {
  const [vendas, setVendas] = useState<Venda[]>([]);

  async function recarregarVendas(): Promise<void> {
    try {
      const dados = await repository.listar();
      setVendas(dados);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  }

  async function adicionarVenda(venda: Venda): Promise<void> {
    try {
      await repository.criar(venda);
      await recarregarVendas();
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
    }
  }

  async function removerVenda(id: string): Promise<void> {
    try {
      await repository.remover(id);
      await recarregarVendas();
    } catch (error) {
      console.error("Erro ao remover venda:", error);
    }
  }

  useEffect(() => {
    recarregarVendas();
  }, []);

  return (
    <VendasContext.Provider
      value={{
        vendas,
        adicionarVenda,
        removerVenda,
        recarregarVendas,
      }}
    >
      {children}
    </VendasContext.Provider>
  );
}

/* =================================================
   HOOK
================================================= */

export function useVendas(): VendasContextType {
  const context = useContext(VendasContext);

  if (!context) {
    throw new Error("useVendas deve ser usado dentro de VendasProvider");
  }

  return context;
}