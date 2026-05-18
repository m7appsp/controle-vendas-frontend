import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Instalacoes from "./pages/Instalacoes";
import ListaVendas from "./pages/ListaVendas";
import Configuracoes from "./pages/Configuracoes";
import NovaVenda from "./pages/NovaVenda";

import Sidebar from "./components/Sidebar";

/* ======================
   LAYOUT
====================== */

function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* SIDEBAR PREMIUM */}
      <Sidebar />

      {/* CONTEÚDO */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

    </div>
  );
}

/* ======================
   APP
====================== */

export default function App() {
  return (
    <Router>

      <Layout>

        <Routes>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* INSTALAÇÕES */}
          <Route
            path="/instalacoes"
            element={<Instalacoes />}
          />

          {/* NOVA VENDA */}
          <Route
            path="/nova-venda"
            element={<NovaVenda />}
          />

          {/* VENDAS */}
          <Route
            path="/vendas"
            element={<ListaVendas />}
          />

          {/* CONFIG */}
          <Route
            path="/configuracoes"
            element={<Configuracoes />}
          />

        </Routes>

      </Layout>

    </Router>
  );
}