import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const servicosOptions = [
  { value: "receita_total", label: "Receita Total" },
  { value: "pos_total", label: "Pós Total" },
  { value: "residencial", label: "Residencial" },
  { value: "aparelho", label: "Aparelhos" },
  { value: "acessorios", label: "Acessórios" },
];

export default function Configuracoes() {
  const hoje = new Date();

  const [open, setOpen] = useState(false);
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [metasSalvas, setMetasSalvas] = useState<any[]>([]);

  const [metas, setMetas] = useState<any[]>([
    { servico: "", tipo_meta: "quantidade", valor_meta: "" },
  ]);

  const [editando, setEditando] = useState<any>(null);

  /* ======================
     CARREGAR METAS
  ====================== */
  const carregarMetas = async () => {
    const { data } = await supabase
      .from("metas")
      .select("*")
      .eq("mes", mes)
      .eq("ano", ano);

    setMetasSalvas(data || []);
  };

  useEffect(() => {
    carregarMetas();
  }, [mes, ano]);

  /* ======================
     ADICIONAR META
  ====================== */
  const adicionarMeta = () => {
    setMetas([
      ...metas,
      { servico: "", tipo_meta: "quantidade", valor_meta: "" },
    ]);
  };

  const atualizarMeta = (index: number, campo: string, valor: any) => {
    const nova = [...metas];
    nova[index][campo] = valor;
    setMetas(nova);
  };

  const removerMeta = (index: number) => {
    if (metas.length > 1) {
      setMetas(metas.filter((_, i) => i !== index));
    }
  };

  /* ======================
     SALVAR
  ====================== */
  const salvar = async () => {
    if (editando) {
      // UPDATE
      const meta = metas[0];

      await supabase
        .from("metas")
        .update({
          servico: meta.servico,
          tipo_meta: meta.tipo_meta,
          valor_meta: Number(meta.valor_meta),
        })
        .eq("id", editando.id);
    } else {
      // INSERT
      const payload = metas
        .filter((m) => m.servico && m.valor_meta)
        .map((m) => ({
          servico: m.servico,
          tipo_meta: m.tipo_meta,
          valor_meta: Number(m.valor_meta),
          mes,
          ano,
        }));

      if (payload.length === 0) return;

      await supabase.from("metas").insert(payload);
    }

    resetForm();
    carregarMetas();
  };

  /* ======================
     EDITAR
  ====================== */
  const iniciarEdicao = (meta: any) => {
    setEditando(meta);

    setMetas([
      {
        servico: meta.servico,
        tipo_meta: meta.tipo_meta,
        valor_meta: meta.valor_meta,
      },
    ]);

    setOpen(true);
  };

  /* ======================
     EXCLUIR
  ====================== */
  const excluir = async (id: string) => {
    await supabase.from("metas").delete().eq("id", id);
    carregarMetas();
  };

  const resetForm = () => {
    setEditando(null);
    setMetas([{ servico: "", tipo_meta: "quantidade", valor_meta: "" }]);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Metas</h1>
        <p className="text-slate-400">
          Gerencie metas mensais
        </p>
      </div>

      {/* BOTÃO */}
      <button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="bg-cyan-500 px-4 py-2 rounded-xl"
      >
        Nova Meta
      </button>

      {/* LISTA */}
      <div className="bg-[#0b1220] p-6 rounded-3xl space-y-3">
        {metasSalvas.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center bg-[#020617] p-4 rounded-xl"
          >
            <div>
              <p className="font-semibold">{m.servico}</p>
              <p className="text-sm text-slate-400">
                {m.tipo_meta} • {m.valor_meta}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => iniciarEdicao(m)}
                className="text-yellow-400"
              >
                Editar
              </button>

              <button
                onClick={() => excluir(m.id)}
                className="text-red-400"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gradient-to-br from-[#0b1220] to-[#020617] w-[750px] max-h-[90vh] rounded-3xl p-6 flex flex-col">

            <h2 className="text-xl font-bold mb-4">
              {editando ? "Editar Meta" : "Nova Meta"}
            </h2>

            <div className="space-y-4 overflow-y-auto max-h-[65vh]">

              {/* PERÍODO */}
              {!editando && (
                <div className="grid grid-cols-2 gap-4">

                  <select
                    value={mes}
                    onChange={(e) => setMes(Number(e.target.value))}
                    className="bg-[#020617] border rounded-xl p-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {new Date(2000, i).toLocaleString("pt-BR", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    className="bg-[#020617] border rounded-xl p-2"
                  />

                </div>
              )}

              {/* CAMPOS */}
              {metas.map((meta, index) => (
                <div key={index} className="space-y-3">

                  <select
                    className="w-full bg-[#020617] border rounded-xl p-2"
                    value={meta.servico}
                    onChange={(e) =>
                      atualizarMeta(index, "servico", e.target.value)
                    }
                  >
                    <option value="">Serviço</option>
                    {servicosOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-3">

                    <select
                      className="bg-[#020617] border rounded-xl p-2"
                      value={meta.tipo_meta}
                      onChange={(e) =>
                        atualizarMeta(index, "tipo_meta", e.target.value)
                      }
                    >
                      <option value="quantidade">Quantidade</option>
                      <option value="faturamento">Faturamento</option>
                    </select>

                    <input
                      type="number"
                      className="bg-[#020617] border rounded-xl p-2"
                      value={meta.valor_meta}
                      onChange={(e) =>
                        atualizarMeta(index, "valor_meta", e.target.value)
                      }
                    />

                  </div>

                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={resetForm}
                className="flex-1 bg-slate-700 p-2 rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={salvar}
                className="flex-1 bg-cyan-500 p-2 rounded-xl"
              >
                Salvar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}