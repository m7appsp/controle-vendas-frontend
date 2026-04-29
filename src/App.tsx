import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import NovaVenda from "./pages/NovaVenda";

import { VendasProvider } from "./features/vendas/context/VendasContext";

function App() {
  return (
    <BrowserRouter>
      {/* CONTEXTO GLOBAL DE VENDAS */}
      <VendasProvider>
        <div className="flex h-screen">

          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 p-6 bg-gray-100 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nova-venda" element={<NovaVenda />} />
            </Routes>
          </main>

        </div>
      </VendasProvider>
    </BrowserRouter>
  );
}

export default App;