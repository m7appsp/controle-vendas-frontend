import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Pencil, Trash2 } from "lucide-react";

const servicosOptions = [
  { value: "receita_total", label: "Receita Total" },
  { value: "pos_total", label: "Pós Total" },
  { value: "residencial", label: "Residencial" },
  { value: "aparelho", label: "Aparelhos" },
  { value: "acessorios", label: "Acessórios" },
];

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

  /* ======================
     CARREGAR METAS
  ====================== */
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

  /* ======================
     AGRUPAR POR MÊS
  ====================== */
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

  /* ======================
     SALVAR / UPDATE
  ====================== */
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

  /* ======================
     EDITAR
  ====================== */
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

  /* ======================
     EXCLUIR
  ====================== */
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
        <h1 className="text-2xl font-bold">Metas</h1>

        <button
          onClick={() => {
            fecharModal();
            setOpen(true);
          }}
          className="bg-cyan-500 px-4 py-2 rounded-xl"
        >
          Nova Meta
        </button>
      </div>

      {/* LISTA AGRUPADA */}
      {Object.keys(agrupado).map((key) => {
        const grupo = agrupado[key];

        return (
          <div key={key} className="bg-[#0b1220] rounded-3xl p-4">

            {/* HEADER DO MÊS */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandido(expandido === key ? null : key)
              }
            >
              <h2 className="text-lg font-semibold capitalize">
                {new Date(grupo.ano, grupo.mes - 1).toLocaleString(
                  "pt-BR",
                  { month: "long", year: "numeric" }
                )}
              </h2>

              <span>
                {expandido === key ? "▲" : "▼"}
              </span>
            </div>

            {/* CONTEÚDO */}
            {expandido === key && (
              <div className="mt-4 space-y-4">

                <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">

                  {/* HEADER INTERNO */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold">
                      Metas Definidas
                    </h3>

                    <p className="text-xs text-slate-400">
                      {grupo.metas.length} metas para{" "}
                      {new Date(grupo.ano, grupo.mes - 1).toLocaleString(
                        "pt-BR",
                        { month: "long" }
                      )}
                    </p>
                  </div>

                  {/* LISTA */}
                  <div className="space-y-3">
                    {grupo.metas.map((m: any) => (
                      <div
                        key={m.id}
                        className="
                          flex justify-between items-center
                          bg-[#020617]
                          border border-white/10
                          rounded-xl p-4
                          hover:bg-white/5 transition
                        "
                      >
                        <div>
                          <p className="font-semibold">
                            {m.servico}
                          </p>

                          <p className="text-sm text-slate-400">
                            Meta: {m.valor_meta} ({m.tipo_meta})
                          </p>

                          <p className="text-xs text-slate-500">
                            Período: Mensal
                          </p>
                        </div>

                        <div className="flex gap-2">

                          {/* EDITAR */}
                          <button
                            onClick={() => editar(m)}
                            className="
                              p-2 rounded-lg
                              border border-white/10
                              hover:bg-white/5 transition
                            "
                          >
                            <Pencil size={16} />
                          </button>

                          {/* EXCLUIR */}
                          <button
                            onClick={() => excluir(m.id)}
                            className="
                              p-2 rounded-lg
                              border border-red-500/30
                              text-red-400
                              hover:bg-red-500/10 transition
                            "
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}

          </div>
        );
      })}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#0b1220] p-6 rounded-2xl w-[500px] space-y-4">

            <h2 className="text-lg font-semibold">
              {editando ? "Editar Meta" : "Nova Meta"}
            </h2>

            <select
              value={form.servico}
              onChange={(e) =>
                setForm({ ...form, servico: e.target.value })
              }
              className="w-full p-2 bg-[#020617] rounded"
            >
              <option value="">Serviço</option>
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
              className="w-full p-2 bg-[#020617] rounded"
            >
              <option value="quantidade">Quantidade</option>
              <option value="faturamento">Faturamento</option>
            </select>

            <input
              type="number"
              value={form.valor_meta}
              onChange={(e) =>
                setForm({ ...form, valor_meta: e.target.value })
              }
              className="w-full p-2 bg-[#020617] rounded"
            />

            {!editando && (
              <div className="flex gap-3">
                <input
                  type="number"
                  value={form.mes}
                  onChange={(e) =>
                    setForm({ ...form, mes: Number(e.target.value) })
                  }
                  className="w-1/2 p-2 bg-[#020617] rounded"
                />
                <input
                  type="number"
                  value={form.ano}
                  onChange={(e) =>
                    setForm({ ...form, ano: Number(e.target.value) })
                  }
                  className="w-1/2 p-2 bg-[#020617] rounded"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={fecharModal}>
                Cancelar
              </button>
              <button onClick={salvar}>
                Salvar
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}