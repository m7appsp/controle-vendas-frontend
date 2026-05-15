import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ListaVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<any>(null);
  const [editando, setEditando] = useState<any>(null);

  const [form, setForm] = useState({
    servico: "",
    quantidade: "",
    receita: "",
  });

  const carregar = async () => {
    const { data } = await supabase
      .from("vendas_individuais")
      .select("*")
      .order("data", { ascending: false });

    setVendas(data || []);
  };

  useEffect(() => {
    carregar();
  }, []);

  /* ======================
     AGRUPAR
  ====================== */
  const agrupado: any = {};

  vendas.forEach((v) => {
    const data = new Date(v.data).toLocaleDateString();
    const cpf = v.cpf || "Sem CPF";

    if (!agrupado[data]) agrupado[data] = {};
    if (!agrupado[data][cpf]) agrupado[data][cpf] = [];

    agrupado[data][cpf].push(v);
  });

  /* ======================
     EXCLUIR
  ====================== */
  const excluir = async (id: string) => {
    await supabase.from("vendas_individuais").delete().eq("id", id);
    carregar();
  };

  /* ======================
     EDITAR
  ====================== */
  const editar = (v: any) => {
    setEditando(v);
    setForm({
      servico: v.servico,
      quantidade: v.quantidade,
      receita: v.receita,
    });
  };

  const salvar = async () => {
    await supabase
      .from("vendas_individuais")
      .update({
        servico: form.servico,
        quantidade: Number(form.quantidade),
        receita: Number(form.receita),
      })
      .eq("id", editando.id);

    setEditando(null);
    carregar();
  };

  return (
    <div className="p-6 text-white space-y-6 bg-[#020617] min-h-screen">

      <h1 className="text-2xl font-bold">Lista de Vendas</h1>

      {Object.keys(agrupado).map((data) => (
        <div key={data} className="bg-[#0b1220] p-4 rounded-2xl">

          <h2 className="text-lg mb-3 font-semibold">{data}</h2>

          {Object.keys(agrupado[data]).map((cpf) => (
            <div key={cpf} className="mb-3">

              <div
                className="cursor-pointer bg-[#020617] p-3 rounded-xl"
                onClick={() =>
                  setExpanded(expanded === cpf ? null : cpf)
                }
              >
                CPF: {cpf}
              </div>

              {expanded === cpf && (
                <div className="mt-2 space-y-2">

                  {agrupado[data][cpf].map((v: any) => (
                    <div
                      key={v.id}
                      className="flex justify-between bg-[#111827] p-3 rounded-xl"
                    >
                      <div>
                        <p>{v.servico}</p>
                        <p className="text-sm text-slate-400">
                          Qtd: {v.quantidade} • R$ {v.receita}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editar(v)}
                          className="text-yellow-400"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => excluir(v.id)}
                          className="text-red-400"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}

        </div>
      ))}

      {/* MODAL */}
      {editando && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

          <div className="bg-[#0b1220] p-6 rounded-2xl w-[400px] space-y-4">

            <h2 className="font-bold">Editar Venda</h2>

            <input
              value={form.servico}
              onChange={(e) =>
                setForm({ ...form, servico: e.target.value })
              }
              className="w-full p-2 bg-[#020617]"
            />

            <input
              type="number"
              value={form.quantidade}
              onChange={(e) =>
                setForm({ ...form, quantidade: e.target.value })
              }
              className="w-full p-2 bg-[#020617]"
            />

            <input
              type="number"
              value={form.receita}
              onChange={(e) =>
                setForm({ ...form, receita: e.target.value })
              }
              className="w-full p-2 bg-[#020617]"
            />

            <div className="flex gap-3">
              <button onClick={() => setEditando(null)}>Cancelar</button>
              <button onClick={salvar}>Salvar</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
``