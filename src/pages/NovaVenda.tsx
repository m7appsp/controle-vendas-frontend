import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Save, ShoppingBag } from "lucide-react";

import { useVendas } from "../features/vendas/context/VendasContext";

function NovaVenda() {
  const navigate = useNavigate();
  const { adicionarVenda } = useVendas();

  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [clienteCpf, setClienteCpf] = useState("");
  const [categoria, setCategoria] = useState("Pos");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!produto || !valor || !clienteNome || !categoria) {
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
      categoria,
    });

    setProduto("");
    setValor("");
    setClienteNome("");
    setClienteCpf("");
    setCategoria("Pos");

    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-8 shadow-[0_0_35px_rgba(6,182,212,0.06)]">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <ShoppingBag className="text-cyan-400" />
          Nova Venda
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Produto"
            value={produto}
            onChange={setProduto}
          />

          <InputField
            label="Valor"
            value={valor}
            onChange={setValor}
            type="number"
          />

          <InputField
            label="Cliente"
            value={clienteNome}
            onChange={setClienteNome}
          />

          <InputField
            label="CPF (opcional)"
            value={clienteCpf}
            onChange={setClienteCpf}
          />

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Categoria</label>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="
                w-full
                px-4 py-4
                rounded-2xl
                bg-[#020617]
                border border-white/10
                text-white
                outline-none
                focus:border-cyan-400
              "
            >
              <option>Pos</option>
              <option>Residencial</option>
              <option>Aparelhos</option>
              <option>Acessórios</option>
            </select>
          </div>

          <button
            type="submit"
            className="
              w-full
              flex items-center justify-center gap-2
              bg-cyan-500 hover:bg-cyan-400
              text-black font-semibold
              py-4 rounded-2xl
              transition
            "
          >
            <Save size={18} />
            Salvar Venda
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-400">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          px-4 py-4
          rounded-2xl
          bg-[#020617]
          border border-white/10
          text-white
          outline-none
          focus:border-cyan-400
        "
      />
    </div>
  );
}

export default NovaVenda;