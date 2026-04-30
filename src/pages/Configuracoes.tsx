import { useEffect, useState } from "react";
import {
  Target,
  Save,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type MetaCategoria = {
  diaria: string;
  mensal: string;
};

type ConfigMes = {
  financeiro: {
    diaria: string;
    mensal: string;
  };
  categorias: Record<string, MetaCategoria>;
  alertas: {
    horario: string;
    notificacoes: boolean;
    reiniciarMes: boolean;
  };
};

const categorias = [
  "Pos",
  "Residencial",
  "Aparelhos",
  "Acessórios",
];

export default function Configuracoes() {
  const [mesSelecionado, setMesSelecionado] = useState(new Date());
  const [config, setConfig] = useState<ConfigMes>({
    financeiro: {
      diaria: "",
      mensal: "",
    },
    categorias: {},
    alertas: {
      horario: "18:00",
      notificacoes: true,
      reiniciarMes: true,
    },
  });

  const chaveMes = `${mesSelecionado.getFullYear()}-${String(
    mesSelecionado.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    const dados = localStorage.getItem("metasMensais");
    const storage = dados ? JSON.parse(dados) : {};

    const configMes = storage[chaveMes];

    if (configMes) {
      setConfig(configMes);
    } else {
      setConfig({
        financeiro: {
          diaria: "",
          mensal: "",
        },
        categorias: categorias.reduce((acc, categoria) => {
          acc[categoria] = { diaria: "", mensal: "" };
          return acc;
        }, {} as Record<string, MetaCategoria>),
        alertas: {
          horario: "18:00",
          notificacoes: true,
          reiniciarMes: true,
        },
      });
    }
  }, [chaveMes]);

  function salvarConfiguracoes() {
    const dados = localStorage.getItem("metasMensais");
    const storage = dados ? JSON.parse(dados) : {};

    storage[chaveMes] = config;

    localStorage.setItem("metasMensais", JSON.stringify(storage));
    alert("Configurações salvas com sucesso!");
  }

  function alterarMes(valor: number) {
    const novaData = new Date(mesSelecionado);
    novaData.setMonth(novaData.getMonth() + valor);
    setMesSelecionado(novaData);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Target className="text-cyan-400" />
            Configurações
          </h1>

          <p className="text-slate-400 mt-2">
            Configure metas mensais e alertas inteligentes.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0f172a] border border-white/10 rounded-2xl px-4 py-3">
          <button onClick={() => alterarMes(-1)}>
            <ChevronLeft />
          </button>

          <CalendarDays size={18} className="text-cyan-400" />

          <span className="capitalize min-w-[140px] text-center">
            {mesSelecionado.toLocaleString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button onClick={() => alterarMes(1)}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <Section title="Metas Financeiras">
        <InputMeta
          label="Receita Total Diária"
          value={config.financeiro.diaria}
          onChange={(v) =>
            setConfig({
              ...config,
              financeiro: { ...config.financeiro, diaria: v },
            })
          }
        />

        <InputMeta
          label="Receita Total Mensal"
          value={config.financeiro.mensal}
          onChange={(v) =>
            setConfig({
              ...config,
              financeiro: { ...config.financeiro, mensal: v },
            })
          }
        />
      </Section>

      <Section title="Metas por Categoria">
        <div className="space-y-6">
          {categorias.map((categoria) => (
            <div
              key={categoria}
              className="border border-white/5 rounded-2xl p-4 space-y-4"
            >
              <h3 className="font-semibold text-cyan-400">{categoria}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <InputMeta
                  label="Meta diária"
                  value={config.categorias[categoria]?.diaria || ""}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      categorias: {
                        ...config.categorias,
                        [categoria]: {
                          ...config.categorias[categoria],
                          diaria: v,
                        },
                      },
                    })
                  }
                />

                <InputMeta
                  label="Meta mensal"
                  value={config.categorias[categoria]?.mensal || ""}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      categorias: {
                        ...config.categorias,
                        [categoria]: {
                          ...config.categorias[categoria],
                          mensal: v,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <button
        onClick={salvarConfiguracoes}
        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 rounded-2xl transition"
      >
        <Save size={18} />
        Salvar Configurações
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028] to-[#0f172a] p-6 space-y-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function InputMeta({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 px-4 py-4 rounded-2xl bg-[#020617] border border-white/10"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}