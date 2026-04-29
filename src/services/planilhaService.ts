import * as XLSX from 'xlsx';

function normalizarTexto(texto: any): string {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export async function lerPlanilha(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet);

      const vendas = rows.map((row) => ({
        Categoria: normalizarTexto(row['Categoria']),
        Quantidade: Number(row['Quantidade'] ?? 0),
        Valor: Number(row['Valor'] ?? 0),
      }));

      console.log('📥 Dados normalizados da planilha:', vendas);
      resolve(vendas);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}