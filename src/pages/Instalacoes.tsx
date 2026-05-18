import { useState } from "react";

export default function Instalacoes() {
  const [instalacoes, setInstalacoes] =
    useState<any[]>([]);

  const [form, setForm] = useState({
    dataVenda: "",
    dataInstalacao: "",
    horario: "",
    cidade: "",
    servico: "",
    quantidade: 1,
    status: "Pendente",
    cliente: "",
    cpf: "",
    observacao: "",
  });

  const atualizarCampo = (
    campo: string,
    valor: any
  ) => {
    setForm({
      ...form,
      [campo]: valor,
    });
  };

  const salvar = () => {
    setInstalacoes([
      ...instalacoes,
      {
        id: Date.now(),
        ...form,
      },
    ]);

    setForm({
      dataVenda: "",
      dataInstalacao: "",
      horario: "",
      cidade: "",
      servico: "",
      quantidade: 1,
      status: "Pendente",
      cliente: "",
      cpf: "",
      observacao: "",
    });
  };

  const remover = (id: number) => {
    setInstalacoes(
      instalacoes.filter((i) => i.id !== id)
    );
  };

  const alterarStatus = (
    id: number,
    status: string
  ) => {
    setInstalacoes(
      instalacoes.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );
  };

  const instalados = instalacoes.filter(
    (i) => i.status === "Instalado"
  ).length;

  const pendentes = instalacoes.filter(
    (i) => i.status === "Pendente"
  ).length;

  const cancelados = instalacoes.filter(
    (i) => i.status === "Cancelado"
  ).length;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Instalações
        </h1>

        <p className="text-slate-400 mt-1">
          Controle operacional das instalações
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0b1220] border border-yellow-500/20 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Pendentes
          </p>

          <h2 className="text-4xl font-bold text-yellow-400 mt-2">
            {pendentes}
          </h2>
        </div>

        <div className="bg-[#0b1220] border border-green-500/20 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Instalados
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-2">
            {instalados}
          </h2>
        </div>

        <div className="bg-[#0b1220] border border-red-500/20 rounded-3xl p-6">
          <p className="text-slate-400 text-sm">
            Cancelados
          </p>

          <h2 className="text-4xl font-bold text-red-400 mt-2">
            {cancelados}
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Nova Instalação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={form.dataVenda}
            onChange={(e) =>
              atualizarCampo(
                "dataVenda",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <input
            type="date"
            value={form.dataInstalacao}
            onChange={(e) =>
              atualizarCampo(
                "dataInstalacao",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <input
            type="time"
            value={form.horario}
            onChange={(e) =>
              atualizarCampo(
                "horario",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <input
            placeholder="Cidade"
            value={form.cidade}
            onChange={(e) =>
              atualizarCampo(
                "cidade",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <input
            placeholder="Serviço"
            value={form.servico}
            onChange={(e) =>
              atualizarCampo(
                "servico",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Quantidade"
            value={form.quantidade}
            onChange={(e) =>
              atualizarCampo(
                "quantidade",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <select
            value={form.status}
            onChange={(e) =>
              atualizarCampo(
                "status",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          >
            <option>Pendente</option>
            <option>Instalado</option>
            <option>Cancelado</option>
          </select>

          <input
            placeholder="Cliente"
            value={form.cliente}
            onChange={(e) =>
              atualizarCampo(
                "cliente",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />

          <input
            placeholder="CPF"
            value={form.cpf}
            onChange={(e) =>
              atualizarCampo(
                "cpf",
                e.target.value
              )
            }
            className="bg-[#020617] border border-white/10 rounded-xl p-3"
          />
        </div>

        <textarea
          placeholder="Observações"
          value={form.observacao}
          onChange={(e) =>
            atualizarCampo(
              "observacao",
              e.target.value
            )
          }
          className="w-full mt-4 bg-[#020617] border border-white/10 rounded-xl p-3 min-h-[120px]"
        />

        <button
          onClick={salvar}
          className="
            mt-6
            bg-cyan-500
            hover:bg-cyan-400
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >
          Salvar Instalação
        </button>
      </div>

      {/* TABELA */}
      <div className="bg-[#0b1220] border border-white/10 rounded-3xl p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">
          Lista de Instalações
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-white/10">
              <th className="text-left py-3">
                Cliente
              </th>

              <th className="text-left py-3">
                Serviço
              </th>

              <th className="text-left py-3">
                Cidade
              </th>

              <th className="text-left py-3">
                Data
              </th>

              <th className="text-left py-3">
                Status
              </th>

              <th className="text-left py-3">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {instalacoes.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5"
              >
                <td className="py-4">
                  {item.cliente}
                </td>

                <td>{item.servico}</td>

                <td>{item.cidade}</td>

                <td>
                  {item.dataInstalacao}
                </td>

                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      alterarStatus(
                        item.id,
                        e.target.value
                      )
                    }
                    className={`
                      px-3 py-2 rounded-lg border
                      ${
                        item.status ===
                        "Instalado"
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : item.status ===
                            "Cancelado"
                          ? "bg-red-500/20 border-red-500 text-red-400"
                          : "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                      }
                    `}
                  >
                    <option>Pendente</option>
                    <option>Instalado</option>
                    <option>Cancelado</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() =>
                      remover(item.id)
                    }
                    className="
                      text-red-400
                      hover:text-red-300
                    "
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}