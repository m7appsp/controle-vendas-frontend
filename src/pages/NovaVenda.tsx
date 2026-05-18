import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar } from "lucide-react";

export default function NovaVenda() {

  const [openCalendar, setOpenCalendar] = useState(false);
  const [dataVenda, setDataVenda] = useState(new Date());

  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const [vendas, setVendas] = useState([
    {
      cpf: "",
      observacao: "",
      itens: [{ servico: "", quantidade: 1, receita: "" }],
    },
  ]);

  /* ✅ fechar dropdown ao clicar fora */
  useEffect(() => {
    const fechar = () => setOpenSelect(null);
    window.addEventListener("click", fechar);

    return () => window.removeEventListener("click", fechar);
  }, []);

  /* ====================== VENDA ====================== */
  const addVenda = () => {
    setVendas([
      ...vendas,
      { cpf: "", observacao: "", itens: [{ servico: "", quantidade: 1, receita: "" }] }
    ]);
  };

  const updateVenda = (index: number, field: string, value: any) => {
    const lista = [...vendas];
    lista[index][field] = value;
    setVendas(lista);
  };

  /* ====================== ITENS ====================== */
  const addItem = (vIndex: number) => {
    const lista = [...vendas];
    lista[vIndex].itens.push({ servico: "", quantidade: 1, receita: "" });
    setVendas(lista);
  };

  const updateItem = (vIndex: number, iIndex: number, field: string, value: any) => {
    const lista = [...vendas];
    lista[vIndex].itens[iIndex][field] = value;
    setVendas(lista);
  };

  const removeItem = (vIndex: number, iIndex: number) => {
    const lista = [...vendas];
    lista[vIndex].itens.splice(iIndex, 1);
    setVendas(lista);
  };

  /* ✅ ====================== SALVAR CORRIGIDO ====================== */
  const salvar = async () => {

    try {
      const payload: any[] = [];

      vendas.forEach((v) => {
        v.itens.forEach((item) => {

          // ✅ valida corretamente (SEM quebrar loop)
          if (v.cpf && item.servico) {
            payload.push({
  cliente_nome: "",
  cliente_cpf: v.cpf,
  servico: item.servico,
  quantidade: Number(item.quantidade || 0),
  receita: Number(
    String(item.receita).replace(",", ".")
  ),
  data: dataVenda.toISOString().split("T")[0],
});
          }

        });
      });

      console.log("Payload:", payload);

      if (payload.length === 0) {
        alert("Preencha CPF e pelo menos um item válido");
        return;
      }

      const { error } = await supabase
        .from("vendas_individuais")
        .insert(payload);

      if (error) {
  console.error("Erro Supabase:", error);
  alert("Erro ao salvar: " + error.message);
  return;
}


      alert("Venda registrada ✅");

      setVendas([
        {
          cpf: "",
          observacao: "",
          itens: [{ servico: "", quantidade: 1, receita: "" }],
        },
      ]);

    } catch (err) {
      console.error("Erro geral:", err);
      alert("Erro inesperado");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center">

      {/* HEADER */}
      <div className="w-full max-w-5xl mb-6">
        <h1 className="text-3xl font-bold">Cadastrar Venda</h1>
      </div>

      {/* CONTAINER */}
      <div className="w-full max-w-5xl bg-[#0b1220] border border-white/10 rounded-3xl p-6 space-y-6">

        {/* ====================== DATA ====================== */}
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">

          <p className="text-sm mb-3">Data da Venda</p>

          <div className="relative">

            <input
              readOnly
              value={dataVenda.toLocaleDateString("pt-BR")}
              onClick={(e) => {
                e.stopPropagation();
                setOpenCalendar(!openCalendar);
              }}
              className="w-full bg-[#020617] border border-white/10 rounded-xl p-3 cursor-pointer"
            />

            <Calendar className="absolute right-3 top-3 text-slate-400" />

            {openCalendar && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-50 mt-2 bg-[#020617] border border-white/10 rounded-xl p-3 shadow-lg"
              >
                <DayPicker
                  mode="single"
                  selected={dataVenda}
                  onSelect={(d) => {
                    if (d) {
                      setDataVenda(d);
                      setOpenCalendar(false);
                    }
                  }}
                />
              </div>
            )}

          </div>

        </div>

        {/* ====================== VENDAS ====================== */}
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4 space-y-4">

          <div className="flex justify-between items-center">
            <span>Vendas do Dia</span>

            <button
              onClick={addVenda}
              className="bg-white/10 px-3 py-1 rounded-lg text-sm"
            >
              + Adicionar Venda
            </button>
          </div>

          {vendas.map((v, vIndex) => (
            <div key={vIndex} className="bg-[#0b1220] rounded-2xl p-4 space-y-4">

              {/* CPF */}
              <input
                placeholder="CPF do Cliente"
                value={v.cpf}
                onChange={(e) =>
                  updateVenda(vIndex, "cpf", e.target.value)
                }
                className="w-full bg-[#020617] border border-white/10 rounded-xl p-3"
              />

              {/* OBS */}
              <input
                placeholder="Observações sobre a venda..."
                value={v.observacao}
                onChange={(e) =>
                  updateVenda(vIndex, "observacao", e.target.value)
                }
                className="w-full bg-[#020617] border border-white/10 rounded-xl p-3"
              />

              {/* ITENS */}
              <div className="space-y-3">

                <div className="flex justify-between text-sm">
                  <span>Itens da Venda</span>

                  <button
                    onClick={() => addItem(vIndex)}
                    className="text-cyan-400"
                  >
                    + Adicionar item
                  </button>
                </div>

                {v.itens.map((item, iIndex) => (
                  <div key={iIndex} className="flex gap-3 items-center">

                    {/* SELECT CUSTOM */}
                    <div className="relative w-[300px]">

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenSelect(
                            openSelect === `${vIndex}-${iIndex}`
                              ? null
                              : `${vIndex}-${iIndex}`
                          );
                        }}
                        className="w-full bg-[#020617] border border-white/10 rounded-xl p-3 text-left flex justify-between items-center"
                      >
                        <span>{item.servico || "Selecione"}</span>
                        <span className="text-slate-400">▼</span>
                      </button>

                      {openSelect === `${vIndex}-${iIndex}` && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-full left-0 mt-2 w-full bg-[#0b1220] border border-white/10 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto"
                        >

                          <div className="px-3 py-2 text-xs text-slate-400 border-b">
                            Pós Total
                          </div>

                          {[
                            "Pós Titular",
                            "Controle",
                            "Migra Pós",
                            "Migra Controle",
                            "Dep Pago",
                            "Dep Grátis",
                            "Banda Larga Móvel",
                          ].map((opcao) => (
                            <button
                              key={opcao}
                              onClick={() => {
                                updateItem(vIndex, iIndex, "servico", opcao);
                                setOpenSelect(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-cyan-500/10"
                            >
                              {opcao}
                            </button>
                          ))}

                          <div className="px-3 py-2 text-xs text-slate-400 border-t">
                            Residencial
                          </div>

                          {["Virtua", "TV Box", "TV Trade", "Fone Fixo"].map((opcao) => (
                            <button
                              key={opcao}
                              onClick={() => {
                                updateItem(vIndex, iIndex, "servico", opcao);
                                setOpenSelect(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-cyan-500/10"
                            >
                              {opcao}
                            </button>
                          ))}

                          <div className="px-3 py-2 text-xs text-slate-400 border-t">
                            Avançados
                          </div>

                          {["Upgrade", "Wifi Mesh", "Trocafy", "Seguro", "M-Play"].map((opcao) => (
                            <button
                              key={opcao}
                              onClick={() => {
                                updateItem(vIndex, iIndex, "servico", opcao);
                                setOpenSelect(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-cyan-500/10"
                            >
                              {opcao}
                            </button>
                          ))}

                          <div className="px-3 py-2 text-xs text-slate-400 border-t">
                            Produtos
                          </div>

                          {["Aparelho", "Acessórios"].map((opcao) => (
                            <button
                              key={opcao}
                              onClick={() => {
                                updateItem(vIndex, iIndex, "servico", opcao);
                                setOpenSelect(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-cyan-500/10"
                            >
                              {opcao}
                            </button>
                          ))}

                        </div>
                      )}

                    </div>

                    <input
                      type="number"
                      value={item.quantidade}
                      onChange={(e) =>
                        updateItem(vIndex, iIndex, "quantidade", e.target.value)
                      }
                      className="w-20 bg-[#020617] border border-white/10 rounded-xl p-3 text-center"
                    />

                    <input
                      placeholder="R$"
                      value={item.receita}
                      onChange={(e) =>
                        updateItem(vIndex, iIndex, "receita", e.target.value)
                      }
                      className="w-32 bg-[#020617] border border-white/10 rounded-xl p-3"
                    />

                    <button
                      onClick={() => removeItem(vIndex, iIndex)}
                      className="text-red-400"
                    >
                      🗑
                    </button>

                  </div>
                ))}

              </div>
            </div>
          ))}
        </div>

        {/* BOTÃO */}
        <button
          onClick={salvar}
          className="bg-cyan-500 px-6 py-3 rounded-xl font-semibold"
        >
          Salvar Venda
        </button>

      </div>
    </div>
  );
}