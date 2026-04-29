type CardProps = {
  titulo: string;
  valor: string;
};

export default function Card({ titulo, valor }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: '#6B7280',
          fontWeight: 500,
        }}
      >
        {titulo}
      </span>

      <strong
        style={{
          fontSize: 26,
          color: '#111827',
        }}
      >
        {valor}
      </strong>
    </div>
  );
}
