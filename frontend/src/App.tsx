// src/App.tsx
import './App.css';
// 1. Importe os componentes do roteador
import { Routes, Route, Link } from 'react-router-dom';

// 2. Importe suas DUAS páginas
import AlunoConsultaPage from "./pages/AlunoConsultaPage";
import AlunoCadastroPage from "./pages/AlunoCadastroPage";

function App() {
  return (
    <>
      {/* 3. Crie um Menu de Navegação */}
      <nav style={{ padding: "10px 20px", backgroundColor: "#333", marginBottom: "20px" }}>
        {/* O 'Link' é como um <a>, mas para o roteador */}
        <Link to="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          Consultar Alunos
        </Link>
        <Link to="/cadastrar" style={{ color: "white", textDecoration: "none" }}>
          Novo Cadastro
        </Link>
      </nav>

      {/* 4. Defina as Rotas (qual página carregar) */}
      <Routes>
        {/* Rota Raiz (/) -> Mostra a página de consulta */}
        <Route path="/" element={<AlunoConsultaPage />} />
        
        {/* Rota (/cadastrar) -> Mostra a página de cadastro */}
        <Route path="/cadastrar" element={<AlunoCadastroPage />} />
      </Routes>
    </>
  )
}

export default App