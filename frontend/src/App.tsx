import './App.css';
import { Routes, Route } from 'react-router-dom';

// 1. Importe o Layout e as novas Páginas
import Layout from './components/Layout';
import AlunosPage from './pages/AlunosPage';
import DisciplinasPage from './pages/DisciplinasPage';
import EnderecosPage from './pages/EnderecosPage';

function App() {
  return (
    <Routes>
      {/* 2. Define o Layout como a "rota pai" */}
      <Route path="/" element={<Layout />}>

        {/* 3. Define as "rotas filhas" que serão
               renderizadas dentro do <Outlet /> do Layout */}
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/disciplinas" element={<DisciplinasPage />} />
        <Route path="/enderecos" element={<EnderecosPage />} />

        {/* Opcional: Uma página inicial padrão */}
        <Route index element={
          <div>
            <h2>Bem-vindo ao Painel</h2>
            <p>Selecione uma entidade no menu ao lado para começar.</p>
          </div>
        } />
        
      </Route>
    </Routes>
  );
}

export default App;