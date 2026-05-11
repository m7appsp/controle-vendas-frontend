import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const SERVICOS = [
  {
    grupo: "Pós Total",
    itens: [
      "Pós Titular",
      "Controle",
      "Migra Pós",
      "Migra Controle",
      "Dep Pago",
      "Dep Grátis",
      "Banda Larga Móvel"
    ]
  },
  {
    grupo: "Residencial",
    itens: ["Virtua", "TV Box", "TV Trade", "Fone Fixo"]
  },
  {
    grupo: "Avançados",
    itens: ["Upgrade", "Wifi Mesh", "Trocafy", "Seguro", "M-Play"]
  },
  {
    grupo: "Produtos",
    itens: ["Aparelho", "Acessórios"]
  }
];

export default function NovaVenda() {
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [data, setData] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const [itens, setItens] = useState([
    { id: 1, servico: "", quantidade: 1, receita: "" }
  ]);

  const adicionarItem = () => {
    setItens((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        servico: "",
        quantidade: 1,
        receita: ""
      }
    ]);
  };

  const removerItem = (id) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const atualizarItem = (id, campo, valor) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );
  };

  const salvarVenda = async (e) => {
    e.preventDefault();

    const registros = itens.map((item) => ({
      data: new Date(`${data}T12:00:00Z`),
      servico: item.servico,
      quantidade: Number(item.quantidade),
      receita: Number(item.receita.replace(",", ".")),
      cliente_nome: cliente,
      cliente_cpf: cpf
    }));

    const { error } = await supabase
      .from("vendas_individuais")
      .insert(registros);

    if (error) {
      console.error(error);
      alert("Erro ao salvar venda");
      return;
    }

    alert("Venda salva com sucesso!");
    setItens([{ id: 1, servico: "", quantidade: 1, receita: "" }]);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Nova Venda</h1>

      <form onSubmit={salvarVenda} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nome do cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="input"
          />

          <input
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="input"
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input col-span-2"
          />
        </div>

        {itens.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-3">
            
            {/* SELECT SERVIÇO */}
            <select
              className="input col-span-5"
              value={item.servico}
              onChange={(e) =>
                atualizarItem(item.id, "servico", e.target.value)
              }
            >
              <option value="">Selecione o serviço</option>

              {SERVICOS.map((grupo) => (
                <optgroup key={grupo.grupo} label={grupo.grupo}>
                  {grupo.itens.map((serv) => (
                    <option key={serv} value={serv}>
                      {serv}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* QUANTIDADE */}
            <input
              type="number"
              min="1"
              className="input col-span-2"
              value={item.quantidade}
              onChange={(e) =>
                atualizarItem(item.id, "quantidade", e.target.value)
              }
            />

            {/* RECEITA */}
            <input
              placeholder="Receita"
              className="input col-span-3"
              value={item.receita}
              onChange={(e) =>
                atualizarItem(item.id, "receita", e.target.value)
              }
            />

            <button
              type="button"
              onClick={() => removerItem(item.id)}
              className="col-span-2 flex justify-center items-center text-red-400"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={adicionarItem}
          className="text-cyan-400 flex gap-2 items-center"
        >
          <Plus /> Adicionar item
        </button>

        <button
          type="submit"
          className="bg-cyan-500 px-6 py-3 rounded-xl flex gap-2 items-center"
        >
          <Save /> Salvar Venda
        </button>
      </form>

      <style>{`
        .input {
          background: #020617;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.6rem;
          border-radius: 10px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
``