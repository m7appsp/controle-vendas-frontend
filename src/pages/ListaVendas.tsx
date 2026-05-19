import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Pencil,
  Trash2,
  DollarSign,
  ShoppingBag,
  Receipt,
  ChevronDown,
  Save,
  X,
  CalendarDays,
} from "lucide-react";

export default function ListaVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [editando, setEditando] = useState<any>(null);

  const [filtroCpf, setFiltroCpf] = useState("");
  const [filtroServico, setFiltroServico] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const [form, setForm] = useState({
    servico: "",
    quantidade: "",
    receita: "",
    data: "",
  });

  async function carregarVendas() {
    setLoading(true);

    const { data, error } = await supabase
      .from("vendas_individuais")
      .select("*")
      .order("data", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setVendas(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarVendas();
  }, []);

  /* =========================
     FILTROS
  ========================= */
  const vendasFiltradas = useMemo(() => {
    return vendas.filter((v) => {
      const cpfMatch = String(v.cliente_cpf || "")
        .toLowerCase()
        .includes(filtroCpf.toLowerCase());

      const servicoMatch = filtroServico
        ? v.servico === filtroServico
        : true;

      const dataMatch = filtroData ? v.data === filtroData : true;

      return cpfMatch && servicoMatch && dataMatch;
    });
  }, [vendas, filtroCpf, filtroServico, filtroData]);

  const servicosUnicos = [...new Set(vendas.map((v) => v.servico))];

  /* =========================
     MÉTRICAS
  ========================= */
  const receitaTotal = useMemo(
    () =>
      vendasFiltradas.reduce(
        (acc, venda) => acc + Number(venda.receita || 0),
        0
      ),
    [vendasFiltradas]
  );

  const quantidadeTotal = useMemo(
    () =>
      vendasFiltradas.reduce(
        (acc, venda) => acc + Number(venda.quantidade || 0),
        0
      ),
    [vendasFiltradas]
  );

  const ticketMedio = useMemo(() => {
    if (!vendasFiltradas.length) return 0;
    return receitaTotal / vendasFiltradas.length;
  }, [vendasFiltradas, receitaTotal]);

  /* =========================
     AGRUPAMENTO
  ========================= */
  const agrupado: any = {};

  vendasFiltradas.forEach((v) => {
    const data = new Date(v.data + "T12:00:00").toLocaleDateString("pt-BR");
    const cpf = v.cliente_cpf || "Sem CPF";

    if (!agrupado[data]) agrupado[data] = {};
    if (!agrupado[data][cpf]) agrupado[data][cpf] = [];

    agrupado[data][cpf].push(v);
  });

  /* =========================
     EXCLUIR
  ========================= */
  async function excluirVenda(id: string) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta venda?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("vendas_individuais")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir venda");
      return;
    }

    carregarVendas();
  }

  /* =========================
     EDITAR
  ========================= */
  function iniciarEdicao(venda: any) {
    setEditando(venda);

    setForm({
      servico: venda.servico,
      quantidade: String(venda.quantidade),
      receita: String(venda.receita),
      data: venda.data,
    });
  }

  async function salvarEdicao() {
    if (!editando) return;

    const { error } = await supabase
      .from("vendas_individuais")
      .update({
        servico: form.servico,
        quantidade: Number(form.quantidade),
        receita: Number(
          String(form.receita).replace(",", ".")
        ),
        data: form.data,
      })
      .eq("id", editando.id);

    if (error) {
      console.error(error);
      alert("Erro ao salvar edição");
      return;
    }

    setEditando(null);
    carregarVendas();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-6">
        Carregando vendas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Lista de Vendas</h1>
        <p className="text-slate-400 mt-1">
          Gerencie e acompanhe vendas registradas
        </p>
      </div>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Buscar CPF"
          value={filtroCpf}
          onChange={(e) => setFiltroCpf(e.target.value)}
          className="input"
        />

        <select
          value={filtroServico}
          onChange={(e) => setFiltroServico(e.target.value)}
          className="input"
        >
          <option value="">Todos serviços</option>

          {servicosUnicos.map((servico) => (
            <option key={servico} value={servico}>
              {servico}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="input"
        />

        <button
          onClick={() => {
            setFiltroCpf("");
            setFiltroServico("");
            setFiltroData("");
          }}
          className="bg-white/5 border border-white/10 rounded-xl px-4"
        >
          Limpar filtros
        </button>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card
          icon={<DollarSign />}
          title="Receita Total"
          value={`R$ ${receitaTotal.toFixed(2)}`}
        />

        <Card
          icon={<ShoppingBag />}
          title="Quantidade"
          value={String(quantidadeTotal)}
        />

        <Card
          icon={<Receipt />}
          title="Ticket Médio"
          value={`R$ ${ticketMedio.toFixed(2)}`}
        />
      </div>

      <p className="text-sm text-slate-400">
        {vendasFiltradas.length} resultados encontrados
      </p>

      {/* LISTA */}
      <div className="space-y-6">
        {Object.keys(agrupado).map((data) => (
          <div
            key={data}
            className="bg-[#0b1220] border border-white/10 rounded-3xl p-5"
          >
            <h2 className="text-lg font-semibold mb-4">{data}</h2>

            {Object.keys(agrupado[data]).map((cpf) => {
              const key = `${data}-${cpf}`;
              const vendasCpf = agrupado[data][cpf];

              const totalCpf = vendasCpf.reduce(
                (acc: number, item: any) =>
                  acc + Number(item.receita || 0),
                0
              );

              return (
                <div key={key} className="mb-4">
                  <button
                    onClick={() =>
                      setExpandido(expandido === key ? null : key)
                    }
                    className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">CPF: {cpf}</p>
                      <p className="text-sm text-slate-400">
                        {vendasCpf.length} itens • R$ {totalCpf.toFixed(2)}
                      </p>
                    </div>

                    <ChevronDown
                      className={`transition ${
                        expandido === key ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandido === key && (
                    <div className="mt-3 space-y-3">
                      {vendasCpf.map((v: any) => (
                        <div
                          key={v.id}
                          className="bg-[#111827] border border-white/5 rounded-2xl p-4 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{v.servico}</p>
                            <p className="text-sm text-slate-400">
                              Qtd: {v.quantidade} • R$ {Number(v.receita).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => iniciarEdicao(v)}
                              className="text-yellow-400"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={() => excluirVenda(v.id)}
                              className="text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editando && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#0b1220] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Editar Venda</h2>

              <button onClick={() => setEditando(null)}>
                <X />
              </button>
            </div>

            <input
              value={form.servico}
              onChange={(e) =>
                setForm({ ...form, servico: e.target.value })
              }
              className="input"
              placeholder="Serviço"
            />

            <input
              type="number"
              value={form.quantidade}
              onChange={(e) =>
                setForm({ ...form, quantidade: e.target.value })
              }
              className="input"
              placeholder="Quantidade"
            />

            <input
              value={form.receita}
              onChange={(e) =>
                setForm({ ...form, receita: e.target.value })
              }
              className="input"
              placeholder="Receita"
            />

            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 text-slate-400" size={18} />

              <input
                type="date"
                value={form.data}
                onChange={(e) =>
                  setForm({ ...form, data: e.target.value })
                }
                className="input pl-10"
              />
            </div>

            <button
              onClick={salvarEdicao}
              className="w-full bg-cyan-500 hover:bg-cyan-400 rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar alterações
            </button>
          </div>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          background: #020617;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px;
          border-radius: 14px;
          outline: none;
          color: white;
        }
      `}</style>
    </div>
  );
}

function Card({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-5">
      <div className="flex items-center gap-3 text-cyan-400 mb-3">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}