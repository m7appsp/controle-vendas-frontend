import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Pencil,
  Trash2,
  Plus,
  Wallet,
  Smartphone,
  Wifi,
  MonitorSmartphone,
  Headphones,
  Target,
} from "lucide-react";

const servicosOptions = [
  { value: "receita_total", label: "Receita Total" },
  { value: "pos_total", label: "Pós Total" },
  { value: "residencial", label: "Residencial" },
  { value: "aparelho", label: "Aparelhos" },
  { value: "acessorios", label: "Acessórios" },
];

const labelsServicos: any = {
  receita_total: "Receita Total",
  pos_total: "Pós Total",
  residencial: "Residencial",
  aparelho: "Aparelhos",
  acessorios: "Acessórios",
};

const iconesServicos: any = {
  receita_total: <Wallet size={18} />,
  pos_total: <Smartphone size={18} />,
  residencial: <Wifi size={18} />,
  aparelho: <MonitorSmartphone size={18} />,
  acessorios: <Headphones size={18} />,
};

export default function Configuracoes() {
  const hoje = new Date();

  const [metas, setMetas] = useState<any[]>([]);
  const [agrupado, setAgrupado] = useState<any>({});
  const [expandido, setExpandido] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);

  const [form, setForm] = useState({
    servico: "",
    tipo_meta: "quantidade",
    valor_meta: "",
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear(),
  });

  /* ====================== */
  const carregar = async () => {
    const { data } = await supabase
      .from("metas")
      .select("*")
      .order("ano", { ascending: false })
      .order("mes", { ascending: false });

    setMetas(data || []);
  };

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    const group: any = {};

    metas.forEach((m) => {
      const key = `${m.ano}-${m.mes}`;

      if (!group[key]) {
        group[key] = {
          mes: m.mes,
          ano: m.ano,
          metas: [],
        };
      }

      group[key].metas.push(m);
    });

    setAgrupado(group);
  }, [metas]);

  /* ====================== */
  const salvar = async () => {
    if (!form.servico || !form.valor_meta) return;

    if (editando) {
      await supabase
        .from("metas")
        .update({
          servico: form.servico,
          tipo_meta: form.tipo_meta,
          valor_meta: Number(form.valor_meta),
        })
        .eq("id", editando.id);
    } else {
      await supabase.from("metas").insert([
        {
          ...form,
          valor_meta: Number(form.valor_meta),
        },
      ]);
    }

    fecharModal();
    carregar();
  };

  const editar = (m: any) => {
    setEditando(m);

    setForm({
      servico: m.servico,
      tipo_meta: m.tipo_meta,
      valor_meta: m.valor_meta,
      mes: m.mes,
      ano: m.ano,
    });

    setOpen(true);
  };

  const excluir = async (id: string) => {
    await supabase.from("metas").delete().eq("id", id);
    carregar();
  };

  const fecharModal = () => {
    setOpen(false);
    setEditando(null);

    setForm({
      servico: "",
      tipo_meta: "quantidade",
      valor_meta: "",
      mes: hoje.getMonth() + 1,
      ano: hoje.getFullYear(),
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configurações de Metas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie metas comerciais e objetivos mensais
          </p>
        </div>

        <button
          onClick={() => {
            fecharModal();
            setOpen(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <Plus size={18} />
          Nova Meta
        </button>
      </div>

      {/* CARDS TOPO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <Target className="text-cyan-400" />
            <span className="text-slate-400 text-sm">Metas cadastradas</span>
          </div>

          <h2 className="text-3xl font-bold mt-4">{metas.length}</h2>
        </div>

        <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Mês Atual</p>
          <h2 className="text-2xl font-bold mt-4 capitalize">
            {hoje.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Última atualização</p>
          <h2 className="text-2xl font-bold mt-4">
            {new Date().toLocaleDateString("pt-BR")}
          </h2>
        </div>
      </div>

      {/* LISTA */}
      {Object.keys(agrupado).map((key) => {
        const grupo = agrupado[key];

        return (
          <div key={key} className="bg-[#0b1220] rounded-3xl p-5 border border-white/10">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandido(expandido === key ? null : key)
              }
            >
              <div>
                <h2 className="text-lg font-semibold capitalize">
                  {new Date(grupo.ano, grupo.mes - 1).toLocaleString(
                    "pt-BR",
                    { month: "long", year: "numeric" }
                  )}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {grupo.metas.length} metas cadastradas
                </p>
              </div>

              <span className="text-slate-400 text-xl">
                {expandido === key ? "▲" : "▼"}
              </span>
            </div>

            {expandido === key && (
              <div className="mt-5 space-y-4">
                {grupo.metas.map((m: any) => (
                  <div
                    key={m.id}
                    className="bg-[#020617] border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                        {iconesServicos[m.servico]}
                      </div>

                      <div>
                        <p className="font-semibold text-lg">
                          {labelsServicos[m.servico]}
                        </p>

                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-400">
                            {m.tipo_meta}
                          </span>

                          <span className="px-2 py-1 rounded-lg text-xs bg-cyan-500/10 text-cyan-400">
                            {m.valor_meta}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editar(m)}
                        className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => excluir(m.id)}
                        className="p-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-6 w-[560px] space-y-5">
            <div>
              <h2 className="text-xl font-bold">
                {editando ? "Editar Meta" : "Nova Meta"}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Configure metas mensais comerciais
              </p>
            </div>

            <select
              value={form.servico}
              onChange={(e) =>
                setForm({ ...form, servico: e.target.value })
              }
              className="w-full p-3 bg-[#020617] rounded-xl border border-white/10"
            >
              <option value="">Selecione serviço</option>
              {servicosOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              value={form.tipo_meta}
              onChange={(e) =>
                setForm({ ...form, tipo_meta: e.target.value })
              }
              className="w-full p-3 bg-[#020617] rounded-xl border border-white/10"
            >
              <option value="quantidade">Quantidade</option>
              <option value="faturamento">Faturamento</option>
            </select>

            <input
              type="number"
              placeholder="Valor da meta"
              value={form.valor_meta}
              onChange={(e) =>
                setForm({ ...form, valor_meta: e.target.value })
              }
              className="w-full p-3 bg-[#020617] rounded-xl border border-white/10"
            />

            {!editando && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={form.mes}
                  onChange={(e) =>
                    setForm({ ...form, mes: Number(e.target.value) })
                  }
                  className="p-3 bg-[#020617] rounded-xl border border-white/10"
                />

                <input
                  type="number"
                  value={form.ano}
                  onChange={(e) =>
                    setForm({ ...form, ano: Number(e.target.value) })
                  }
                  className="p-3 bg-[#020617] rounded-xl border border-white/10"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={fecharModal}
                className="px-5 py-3 rounded-xl border border-white/10"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-xl font-semibold"
              >
                Salvar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}