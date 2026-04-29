import { servicos } from '../services/servicosService';

export default function Servicos() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Serviços e Produtos
      </h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#FFFFFF',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <thead style={{ background: '#F3F4F6' }}>
          <tr>
            <th style={{ padding: 12, textAlign: 'left' }}>Nome</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Tipo</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Categoria</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Valor (R$)</th>
          </tr>
        </thead>

        <tbody>
          {servicos.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: 12 }}>{item.nome}</td>
              <td style={{ padding: 12 }}>{item.tipo}</td>
              <td style={{ padding: 12 }}>{item.categoria}</td>
              <td style={{ padding: 12 }}>
                {item.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}