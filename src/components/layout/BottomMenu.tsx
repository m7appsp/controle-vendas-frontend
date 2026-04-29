import { Link, useLocation } from 'react-router-dom';

export default function BottomMenu() {
  const location = useLocation();

  function linkStyle(path: string) {
    return {
      color: location.pathname === path ? '#4F46E5' : '#6B7280',
      fontWeight: location.pathname === path ? '600' : '400',
      textDecoration: 'none',
    };
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Link to="/" style={linkStyle('/')}>Dashboard</Link>
      <Link to="/servicos" style={linkStyle('/servicos')}>Serviços</Link>
      <Link to="/planilhas" style={linkStyle('/planilhas')}>Planilhas</Link>
      <Link to="/configuracao" style={linkStyle('/configuracao')}>Configuração</Link>
    </div>
  );
}
``