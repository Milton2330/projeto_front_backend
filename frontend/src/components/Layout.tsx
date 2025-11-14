import { Outlet, Link } from "react-router-dom";

// CSS-in-JS simples para o layout
const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
};

const sidebarStyle = {
  width: "220px",
  backgroundColor: "#5a4f4fff",
  padding: "20px",
  borderRight: "1px solid #ccc",
};

const navLinkStyle = {
  display: "block",
  padding: "10px 15px",
  textDecoration: "none",
  color: "#333",
  fontWeight: 500,
  borderRadius: "5px",
};

const contentStyle = {
  flex: 1, // Ocupa o resto do espaço
  padding: "30px",
};

export default function Layout() {
  return (
    <div style={layoutStyle}>
      {/* 1. O Sidebar (Menu de Navegação) */}
      <nav style={sidebarStyle}>
        <h2>Painel</h2>
        <Link to="/alunos" style={navLinkStyle}>
          Alunos
        </Link>
        <Link to="/disciplinas" style={navLinkStyle}>
          Disciplinas
        </Link>
        <Link to="/enderecos" style={navLinkStyle}>
          Endereços
        </Link>
      </nav>

      {/* 2. A Área de Conteúdo Principal */}
      <main style={contentStyle}>
        {/* O <Outlet /> é o componente do React Router
            onde as páginas (AlunosPage, etc.) serão renderizadas */}
        <Outlet />
      </main>
    </div>
  );
}