import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PlusCircle,
  Edit,
  Trash2,
  Plus,
  User,
  IdCard,
} from "lucide-react";

import { useVendas } from "../features/vendas/context/VendasContext";
import { formatMoeda } from "../utils/format";

/* =================================================
   TIPOS
================================================= */
type ItemVenda = {
  produto: string;
  categoria: "Pos" | "Residencial" | "Aparelhos";
  quantidade: number;
  valor: number;
};

/* =================================================
   NOVA / EDITAR VENDA
================================================= */
export default function NovaVenda() {
  const { adicionarVenda, atualizarVenda } = useVendas();
  const navigate = useNavigate();
  const location = useLocation();

  const vendaEmEdicao = location.state?.venda ?? null;

  const [id, setId] = useState<string | null>(null);
  const [clienteNome, setClienteNome] = useState("");
  const [clienteCpf, setClienteCpf] = useState("");
  const [itens, setItens] = useState<ItemVenda[]>([
    { produto: "", categoria: "Pos", quantidade: 1, valor: 0 },
  ]);

  /* =================================================
     CARREGAR VENDA EM EDIÇÃO
  ================================================= */
  useEffect(() => {
    if (vendaEmEdicao) {
      setId(vendaEmEdicao.id);
      setClienteNome(vendaEmEdicao.clienteNome || "");
      setClienteCpf(vendaEmEdicao.clienteCpf || "");
      if (Array.isArray(vendaEmEdicao.itens)) {
        setItens(vendaEmEdicao.itens);
      }
    }
  }, [vendaEmEdicao]);

  /* =================================================
     TOTAL DA VENDA
  ================================================= */
  const totalVenda = itens.reduce(
    (acc, item) => acc + item.quantidade * item.valor,
    0
  );

  /* =================================================
     FUNÇÕES
  ================================================= */
  function atualizarItem(
    index: number,
    campo: keyof ItemVenda,
    valor: string | number
  ) {
    const novosItens = [...itens];

    novosItens[index] = {
      ...novosItens[index],
      [campo]:
        campo === "quantidade" || campo === "valor"
          ? Number(valor)
          : valor,
    };

    setItens(novosItens);
  }

  function adicionarItem() {
    setItens([
      ...itens,
      { produto: "", categoria: "Pos", quantidade: 1, valor: 0 },
    ]);
  }

  function removerItem(index: number) {
    if (itens.length === 1) return;
    setItens(itens.filter((_, i) => i !== index));
  }

  async function salvarVenda(e: React.FormEvent) {
    e.preventDefault();

    if (
      !clienteNome ||
      !clienteCpf ||
      itens.some(
        (item) => !item.produto || item.quantidade <= 0 || item.valor <= 0
      )
    ) {
      alert("Preencha corretamente todos os campos.");
      return;
    }

    const payload = {
      id: id ?? crypto.randomUUID(),
      clienteNome,
      clienteCpf,
      produto: "Venda múltipla",
      categoria: "Múltipla",
      valor: totalVenda,
      data: new Date().toISOString(),
      itens,
    };

    if (id) {
      await atualizarVenda(payload);
    } else {
      await adicionarVenda(payload);
    }

    navigate("/");
  }

  /* =================================================
     RENDER
  ================================================= */
  return (
    <div className="min-h-screen bg-[#020617] flex justify-center items-center p-6 text-white">
      <form
        onSubmit={salvarVenda}
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0b1220] p-8 space-y-6 shadow-md"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          {id ? (
            <Edit className="text-emerald-400" />
          ) : (
            <PlusCircle className="text-cyan-400" />
          )}
          <h1 className="text-3xl font-bold">
            {id ? "Editar Venda" : "Nova Venda"}
          </h1>
        </div>

        {/* CLIENTE */}
        <div className="space-y-4">
          <Field label="Nome do Cliente" icon={<User size={16} />}>
            <input
              className="input-dark"
              value={clienteNome}
              onChange={(e) => setClienteNome(e.target.value)}
              placeholder="Nome completo"
            />
          </Field>

          <Field label="CPF do Cliente" icon={<IdCard size={16} />}>
            <input
              className="input-dark"
              value={clienteCpf}
              onChange={(e) => setClienteCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </Field>
        </div>

        {/* ITENS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-300">
            Itens da venda
          </h2>

          {itens.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end bg-[#020617] p-4 rounded-2xl border border-white/10"
            >
              <input
                className="input-dark md:col-span-2"
                placeholder="Produto / Serviço"
                value={item.produto}
                onChange={(e) =>
                  atualizarItem(index, "produto", e.target.value)
                }
              />

              <select
                className="input-dark"
                value={item.categoria}
                onChange={(e) =>
                  atualizarItem(index, "categoria", e.target.value)
                }
              >
                <option value="Pos">Pós</option>
                <option value="Residencial">Residencial</option>
                <option value="Aparelhos">Aparelhos</option>
              </select>

              <input
                type="number"
                min={1}
                className="input-dark"
                value={item.quantidade}
                onChange={(e) =>
                  atualizarItem(index, "quantidade", e.target.value)
                }
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  className="input-dark w-full"
                  value={item.valor}
                  onChange={(e) =>
                    atualizarItem(index, "valor", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removerItem(index)}
                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarItem}
            className="flex items-center gap-2 text-cyan-400 text-sm"
          >
            <Plus size={16} /> Adicionar item
          </button>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center border-t border-white/10 pt-4">
          <span className="text-slate-400">Total da venda</span>
          <span className="text-2xl font-bold text-emerald-400">
            {formatMoeda(totalVenda)}
          </span>
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          className={`w-full py-4 rounded-2xl font-semibold ${
            id
              ? "bg-emerald-500 hover:bg-emerald-400"
              : "bg-cyan-500 hover:bg-cyan-400"
          } transition`}
        >
          {id ? "Atualizar Venda" : "Salvar Venda"}
        </button>
      </form>

      {/* ESTILO DOS INPUTS */}
      <style>{`
        .input-dark {
          width: 100%;
          background-color: #020617;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 0.7rem 0.9rem;
          color: white;
        }
        .input-dark:focus {
          outline: none;
          border-color: #22d3ee;
        }
      `}</style>
    </div>
  );
}

/* =================================================
   FIELD
================================================= */
function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm text-slate-400">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}