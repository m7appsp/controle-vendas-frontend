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

  useEffect(() => {
    const fechar = () => setOpenSelect(null);
    window.addEventListener("click", fechar);
    return () => window.removeEventListener("click", fechar);
  }, []);

  const addVenda = () => {
    setVendas([
      ...vendas,
      {
        cpf: "",
        observacao: "",
        itens: [{ servico: "", quantidade: 1, receita: "" }],
      },
    ]);
  };

  const updateVenda = (index: number, field: string, value: any) => {
    const lista = [...vendas];
    lista[index][field] = value;
    setVendas(lista);
  };

  const addItem = (vIndex: number) => {
    const lista = [...vendas];
    lista[vIndex].itens.push({
      servico: "",
      quantidade: 1,
      receita: "",
    });
    setVendas(lista);
  };

  const updateItem = (
    vIndex: number,
    iIndex: number,
    field: string,
    value: any
  ) => {
    const lista = [...vendas];
    lista[vIndex].itens[iIndex][field] = value;
    setVendas(lista);
  };

  const removeItem = (vIndex: number, iIndex: number) => {
    const lista = [...vendas];
    lista[vIndex].itens.splice(iIndex, 1);
    setVendas(lista);
  };

  /* ================= SALVAR ================= */
  const salvar = async () => {
    try {
      const payload: any[] = [];

      for (const venda of vendas) {
        for (const item of venda.itens) {
          if (!venda.cpf || !item.servico) continue;

          const receitaNumerica = Number(
            String(item.receita || "0").replace(",", ".")
          );

          if (!item.receita || receitaNumerica <= 0) {
            alert(
              `Preencha receita válida para o serviço ${item.servico}`
            );
            return;
          }

          payload.push({
            cliente_nome: "",
            cliente_cpf: venda.cpf,
            servico: item.servico,
            quantidade: Number(item.quantidade || 1),
            receita: receitaNumerica,
            data: dataVenda.toISOString().split("T")[0],
          });
        }
      }

      if (payload.length === 0) {
        alert("Preencha CPF, serviço e receita.");
        return;
      }

      console.log("Payload enviado:", payload);

      const { error } = await supabase
        .from("vendas_individuais")
        .insert(payload);

      if (error) {
        console.error(error);
        alert("Erro ao salvar: " + error.message);
        return;
      }

      alert("Venda registrada com sucesso ✅");

      setVendas([
        {
          cpf: "",
          observacao: "",
          itens: [{ servico: "", quantidade: 1, receita: "" }],
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-6">
        <h1 className="text-3xl font-bold">Cadastrar Venda</h1>
      </div>

      <div className="w-full max-w-5xl bg-[#0b1220] border border-white/10 rounded-3xl p-6 space-y-6">
        {/* DATA */}
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
                className="absolute z-50 mt-2 bg-[#020617] border border-white/10 rounded-xl p-3"
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

        {/* VENDAS */}
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="flex justify-between">
            <span>Vendas do Dia</span>

            <button
              onClick={addVenda}
              className="bg-white/10 px-3 py-1 rounded-lg text-sm"
            >
              + Adicionar Venda
            </button>
          </div>

          {vendas.map((v, vIndex) => (
            <div
              key={vIndex}
              className="bg-[#0b1220] rounded-2xl p-4 space-y-4"
            >
              <input
                placeholder="CPF do Cliente"
                value={v.cpf}
                onChange={(e) =>
                  updateVenda(vIndex, "cpf", e.target.value)
                }
                className="w-full bg-[#020617] border border-white/10 rounded-xl p-3"
              />

              <input
                placeholder="Observações"
                value={v.observacao}
                onChange={(e) =>
                  updateVenda(vIndex, "observacao", e.target.value)
                }
                className="w-full bg-[#020617] border border-white/10 rounded-xl p-3"
              />

              {v.itens.map((item, iIndex) => (
                <div key={iIndex} className="flex gap-3">
                  <input
                    placeholder="Serviço"
                    value={item.servico}
                    onChange={(e) =>
                      updateItem(
                        vIndex,
                        iIndex,
                        "servico",
                        e.target.value
                      )
                    }
                    className="flex-1 bg-[#020617] border border-white/10 rounded-xl p-3"
                  />

                  <input
                    type="number"
                    value={item.quantidade}
                    onChange={(e) =>
                      updateItem(
                        vIndex,
                        iIndex,
                        "quantidade",
                        e.target.value
                      )
                    }
                    className="w-24 bg-[#020617] border border-white/10 rounded-xl p-3"
                  />

                  <input
                    placeholder="Receita"
                    value={item.receita}
                    onChange={(e) =>
                      updateItem(
                        vIndex,
                        iIndex,
                        "receita",
                        e.target.value
                      )
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

              <button
                onClick={() => addItem(vIndex)}
                className="text-cyan-400 text-sm"
              >
                + Adicionar item
              </button>
            </div>
          ))}
        </div>

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