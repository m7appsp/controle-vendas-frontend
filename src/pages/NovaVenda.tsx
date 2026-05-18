import { useState } from "react";
import { supabase } from "../lib/supabase";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar } from "lucide-react";

const SERVICOS = {
  Pós: [
    "Pós Titular",
    "Controle",
    "Migra Pós",
    "Migra Controle",
    "Dep Pago",
    "Dep Grátis",
    "Banda Larga Móvel",
  ],

  Residencial: [
    "Virtua",
    "TV Box",
    "TV Trade",
    "Fone Fixo",
  ],

  Avançados: [
    "Upgrade",
    "Wifi Mesh",
    "Trocafy",
    "Seguro",
    "M-Play",
  ],

  Produtos: [
    "Aparelho",
    "Acessórios",
  ],
};

export default function NovaVenda() {
  const [openCalendar, setOpenCalendar] =
    useState(false);

  const [dataVenda, setDataVenda] =
    useState(new Date());

  const [selectAberto, setSelectAberto] =
    useState<string | null>(null);

  const [vendas, setVendas] = useState([
    {
      cpf: "",
      observacao: "",
      itens: [
        {
          servico: "",
          quantidade: 1,
          receita: "",
        },
      ],
    },
  ]);

  /* =========================
     ADICIONAR VENDA
  ========================= */

  const addVenda = () => {
    setVendas([
      ...vendas,
      {
        cpf: "",
        observacao: "",
        itens: [
          {
            servico: "",
            quantidade: 1,
            receita: "",
          },
        ],
      },
    ]);
  };

  /* =========================
     UPDATE VENDA
  ========================= */

  const updateVenda = (
    index: number,
    field: string,
    value: any
  ) => {
    const lista = [...vendas];

    lista[index][field] = value;

    setVendas(lista);
  };

  /* =========================
     ADICIONAR ITEM
  ========================= */

  const addItem = (vIndex: number) => {
    const lista = [...vendas];

    lista[vIndex].itens.push({
      servico: "",
      quantidade: 1,
      receita: "",
    });

    setVendas(lista);
  };

  /* =========================
     UPDATE ITEM
  ========================= */

  const updateItem = (
    vIndex: number,
    iIndex: number,
    field: string,
    value: any
  ) => {
    const lista = [...vendas];

    lista[vIndex].itens[iIndex][field] =
      value;

    setVendas(lista);
  };

  /* =========================
     REMOVER ITEM
  ========================= */

  const removeItem = (
    vIndex: number,
    iIndex: number
  ) => {
    const lista = [...vendas];

    lista[vIndex].itens.splice(iIndex, 1);

    setVendas(lista);
  };

  /* =========================
     SALVAR
  ========================= */

  const salvar = async () => {
    try {
      const payload: any[] = [];

      for (const venda of vendas) {
        for (const item of venda.itens) {
          if (!venda.cpf || !item.servico)
            continue;

          const receitaNumerica = Number(
            String(item.receita || "0")
              .replace(",", ".")
          );

          if (
            !item.receita ||
            receitaNumerica <= 0
          ) {
            alert(
              `Preencha receita válida para o serviço ${item.servico}`
            );

            return;
          }

          payload.push({
            cliente_nome: "",
            cliente_cpf: venda.cpf,
            servico: item.servico,
            quantidade: Number(
              item.quantidade || 1
            ),
            receita: receitaNumerica,

            data: `${dataVenda.getFullYear()}-${String(
              dataVenda.getMonth() + 1
            ).padStart(2, "0")}-${String(
              dataVenda.getDate()
            ).padStart(2, "0")}`,
          });
        }
      }

      if (payload.length === 0) {
        alert(
          "Preencha CPF, serviço e receita."
        );

        return;
      }

      const { error } = await supabase
        .from("vendas_individuais")
        .insert(payload);

      if (error) {
        console.error(error);

        alert(
          "Erro ao salvar: " + error.message
        );

        return;
      }

      alert("Venda registrada com sucesso ✅");

      setVendas([
        {
          cpf: "",
          observacao: "",
          itens: [
            {
              servico: "",
              quantidade: 1,
              receita: "",
            },
          ],
        },
      ]);
    } catch (err) {
      console.error(err);

      alert("Erro inesperado");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-5xl mb-6">
        <h1 className="text-3xl font-bold">
          Cadastrar Venda
        </h1>
      </div>

      {/* CONTAINER */}
      <div className="w-full max-w-5xl bg-[#0b1220] border border-white/10 rounded-3xl p-6 space-y-6">
        {/* DATA */}
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4">
          <p className="text-sm mb-3">
            Data da Venda
          </p>

          <div className="relative">
            <input
              readOnly
              value={dataVenda.toLocaleDateString(
                "pt-BR"
              )}
              onClick={(e) => {
                e.stopPropagation();

                setOpenCalendar(
                  !openCalendar
                );
              }}
              className="
                w-full
                bg-[#020617]
                border
                border-white/10
                rounded-xl
                p-3
                cursor-pointer
              "
            />

            <Calendar className="absolute right-3 top-3 text-slate-400" />

            {openCalendar && (
              <div
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="
                  absolute
                  z-50
                  mt-2
                  bg-[#020617]
                  border
                  border-white/10
                  rounded-xl
                  p-3
                "
              >
                <DayPicker
                  mode="single"
                  selected={dataVenda}
                  onSelect={(d) => {
                    if (d) {
                      setDataVenda(d);

                      setOpenCalendar(
                        false
                      );
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* VENDAS */}
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-4 space-y-4">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Vendas do Dia
            </span>

            <button
              onClick={addVenda}
              className="
                bg-white/10
                hover:bg-white/20
                px-3
                py-1
                rounded-lg
                text-sm
              "
            >
              + Adicionar Venda
            </button>
          </div>

          {/* LISTA */}
          {vendas.map((v, vIndex) => (
            <div
              key={vIndex}
              className="
                bg-[#0b1220]
                rounded-2xl
                p-4
                space-y-4
              "
            >
              {/* CPF */}
              <input
                placeholder="CPF do Cliente"
                value={v.cpf}
                onChange={(e) =>
                  updateVenda(
                    vIndex,
                    "cpf",
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-[#020617]
                  border
                  border-white/10
                  rounded-xl
                  p-3
                "
              />

              {/* OBS */}
              <input
                placeholder="Observações sobre a venda..."
                value={v.observacao}
                onChange={(e) =>
                  updateVenda(
                    vIndex,
                    "observacao",
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-[#020617]
                  border
                  border-white/10
                  rounded-xl
                  p-3
                "
              />

              {/* TOPO ITENS */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Itens da Venda
                </span>

                <button
                  onClick={() =>
                    addItem(vIndex)
                  }
                  className="
                    text-cyan-400
                    text-sm
                    hover:text-cyan-300
                  "
                >
                  + Adicionar item
                </button>
              </div>

              {/* ITENS */}
              {v.itens.map(
                (item, iIndex) => (
                  <div
                    key={iIndex}
                    className="
                      flex
                      gap-3
                      items-start
                      mb-4
                      relative
                    "
                  >
                    {/* SELECT CUSTOM */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          const key = `${vIndex}-${iIndex}`;

                          setSelectAberto(
                            selectAberto ===
                              key
                              ? null
                              : key
                          );
                        }}
                        className="
                          w-[240px]
                          bg-[#020617]
                          border
                          border-white/10
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-white
                          flex
                          items-center
                          justify-between
                          hover:border-cyan-400
                        "
                      >
                        <span>
                          {item.servico ||
                            "Selecione"}
                        </span>

                        <span className="text-cyan-400">
                          ▼
                        </span>
                      </button>

                      {/* DROPDOWN */}
                      {selectAberto ===
                        `${vIndex}-${iIndex}` && (
                        <div
                          className="
                            absolute
                            top-full
                            left-0
                            mt-2
                            w-[240px]
                            max-h-[320px]
                            overflow-y-auto
                            bg-[#020617]
                            border
                            border-cyan-500/30
                            rounded-xl
                            shadow-2xl
                            z-50
                          "
                        >
                          {Object.entries(
                            SERVICOS
                          ).map(
                            ([
                              categoria,
                              itens,
                            ]) => (
                              <div
                                key={
                                  categoria
                                }
                              >
                                {/* CATEGORIA */}
                                <div
                                 className="
  px-1
  pt-4
  pb-2
  text-cyan-500
  text-[17px]
  font-bold
  tracking-wide
"
                                >
                                  {
                                    categoria
                                  }
                                </div>

                                {/* ITENS */}
                                {itens.map(
                                  (
                                    servico
                                  ) => (
                                    <button
                                      key={
                                        servico
                                      }
                                      type="button"
                                      onClick={() => {
                                        updateItem(
                                          vIndex,
                                          iIndex,
                                          "servico",
                                          servico
                                        );

                                        setSelectAberto(
                                          null
                                        );
                                      }}
                                      className="
                                        w-full
                                        text-left
                                        px-3
                                        py-2
                                        hover:bg-cyan-500/10
                                        text-white
                                        transition
                                      "
                                    >
                                      {
                                        servico
                                      }
                                    </button>
                                  )
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* QUANTIDADE */}
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
                      className="
                        w-16
                        bg-[#020617]
                        border
                        border-white/10
                        rounded-xl
                        p-3
                        text-center
                      "
                    />

                    {/* RECEITA */}
                    <input
                      placeholder="R$"
                      value={item.receita}
                      onChange={(e) =>
                        updateItem(
                          vIndex,
                          iIndex,
                          "receita",
                          e.target.value
                        )
                      }
                      className="
                        w-24
                        bg-[#020617]
                        border
                        border-white/10
                        rounded-xl
                        p-3
                      "
                    />

                    {/* REMOVER */}
                    <button
                      onClick={() =>
                        removeItem(
                          vIndex,
                          iIndex
                        )
                      }
                      className="
                        text-red-400
                        hover:text-red-300
                        mt-3
                      "
                    >
                      🗑
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* BOTÃO */}
        <button
          onClick={salvar}
          className="
            bg-cyan-500
            hover:bg-cyan-400
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >
          Salvar Venda
        </button>
      </div>
    </div>
  );
}