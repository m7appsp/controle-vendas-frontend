type MetaCardProps = {
  titulo: string;
  valor: string;
  percentual: number;
  cor: string;
  icone: string;
};

export default function MetaCard({
  titulo,
  valor,
  percentual,
  cor,
  icone,
}: MetaCardProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Topo */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, color: '#6B7280' }}>{titulo}</span>
        <span style={{ fontSize: 22 }}>{icone}</span>
      </div>

      {/* Valor */}
      <strong style={{ fontSize: 26, color: '#111827' }}>
        {valor}
      </strong>

      {/* Barra de progresso */}
      <div>
        <div
          style={{
            height: 8,
            background: '#E5E7EB',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percentual}%`,
              height: '100%',
              background: cor,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: '#6B7280',
          }}
        >
          Meta mensal: {percentual}%
        </div>
      </div>
    </div>
  );
}
