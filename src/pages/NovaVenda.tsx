import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { useVendas } from "../features/vendas/context/VendasContext";

function NovaVenda() {
  const navigate = useNavigate();
  const { adicionarVenda } = useVendas();

  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [clienteCpf, setClienteCpf] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!produto || !valor || !clienteNome) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    await adicionarVenda({
      id: uuid(),
      produto,
      valor: Number(valor),
      data: new Date().toISOString(),
      clienteNome,
      clienteCpf: clienteCpf || undefined,
    });

    // Limpa formulário
    setProduto("");
    setValor("");
    setClienteNome("");
    setClienteCpf("");

    // Volta para o dashboard
    navigate("/");
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Nova Venda</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PRODUTO */}
        <div>
          <label className="block text-sm font-medium mb-1">Produto</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
          />
        </div>

        {/* VALOR */}
        <div>
          <label className="block text-sm font-medium mb-1">Valor</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded p-2"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        {/* CLIENTE */}
        <div>
          <label className="block text-sm font-medium mb-1">Cliente</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
          />
        </div>

        {/* CPF (opcional) */}
        <div>
          <label className="block text-sm font-medium mb-1">CPF (opcional)</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={clienteCpf}
            onChange={(e) => setClienteCpf(e.target.value)}
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Salvar Venda
        </button>
      </form>
    </div>
  );
}

export default NovaVenda;
``