import { lerPlanilha } from '../services/planilhaService';
import { useVendas } from '../context/VendasContext';

export default function Planilhas() {
  const { setVendas } = useVendas();

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files || e.target.files.length === 0) return;

    const arquivo = e.target.files[0];
    const dados = await lerPlanilha(arquivo);

    setVendas(dados);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 26, marginBottom: 16 }}>
        Upload de Planilhas
      </h1>

      <input type="file" accept=".xlsx" onChange={handleUpload} />

      <p style={{ marginTop: 16 }}>
        Após o upload, o Dashboard será atualizado automaticamente ✅
      </p>
    </div>
  );
}