import { useMemo } from 'react';

export default function Header() {
  const dataHoje = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  return (
    <div
      style={{
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* ESQUERDA */}
      <div>
        <div style={{ fontSize: 14, color: '#6B7280' }}>
          Bem-vindo,
        </div>
        <strong style={{ fontSize: 16, color: '#111827' }}>
          Marcelo
        </strong>
        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
          {dataHoje}
        </div>
      </div>

      {/* DIREITA */}
      <div style={{ display: 'flex', gap: 20 }}>
        <span
          title="Meta em atenção"
          style={{
            color: '#F59E0B',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ⚠️
        </span>

        <span
          title="Notificações"
          style={{
            color: '#4F46E5',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          🔔
        </span>
      </div>
    </div>
  );
}
