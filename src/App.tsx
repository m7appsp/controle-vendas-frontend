import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import NovaVenda from "./pages/NovaVenda";
import Configuracoes from "./pages/Configuracoes";

import { VendasProvider } from "./features/vendas/context/VendasContext";

function App() {
  return (
    <BrowserRouter>
      <VendasProvider>
        <div className="flex h-screen bg-[#020617] text-white">
          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 p-6 bg-[#020617] overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nova-venda" element={<NovaVenda />} />
              <Route
                path="/configuracoes"
                element={<Configuracoes />}
              />
            </Routes>
          </main>
        </div>
      </VendasProvider>
    </BrowserRouter>
  );
}

export default App;