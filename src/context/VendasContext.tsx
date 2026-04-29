import { createContext, useContext, useEffect, useState } from 'react';

type VendasContextType = {
  vendas: any[];
  setVendas: (v: any[]) => void;
};

const VendasContext = createContext<VendasContextType>({
  vendas: [],
  setVendas: () => {},
});

export function VendasProvider({ children }: { children: React.ReactNode }) {
 const [vendas, setVendasState] = useState<any[]>([
  { Categoria: 'pos', Quantidade: 2, Valor: 100 },
  { Categoria: 'residencial', Quantidade: 1, Valor: 150 },
  { Categoria: 'avancado', Quantidade: 3, Valor: 50 },
]);

  // ✅ Carrega do localStorage ao iniciar
  useEffect(() => {
    const salvo = localStorage.getItem('vendas');
    if (salvo) {
      setVendasState(JSON.parse(salvo));
    }
  }, []);

  // ✅ Salva no localStorage sempre que mudar
  function setVendas(v: any[]) {
    setVendasState(v);
    localStorage.setItem('vendas', JSON.stringify(v));
  }

  return (
    <VendasContext.Provider value={{ vendas, setVendas }}>
      {children}
    </VendasContext.Provider>
  );
}

export function useVendas() {
  return useContext(VendasContext);
}
``