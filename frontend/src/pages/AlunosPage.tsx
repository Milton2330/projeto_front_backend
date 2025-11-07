import { useState } from "react";

// 1. Importe os 4 componentes que acabamos de criar
import AlunoConsultar from "../components/AlunoConsultar";
import AlunoCriar from "../components/AlunoCriar";
import AlunoAtualizar from "../components/AlunoAtualizar";
import AlunoExcluir from "../components/AlunoExcluir";

// CSS-in-JS simples para os botões das abas
const tabContainerStyle = {
  display: "flex",
  borderBottom: "2px solid #ccc",
  marginBottom: "20px",
};

const tabButtonStyle = {
  padding: "10px 20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontSize: "16px",
};

// Estilo para a aba ATIVA
const activeTabStyle = {
  ...tabButtonStyle, // Herda os estilos base
  borderBottom: "3px solid blue",
  fontWeight: "bold",
};


export default function AlunosPage() {
  // 2. Crie um estado para controlar a aba ativa
  // ('consultar', 'criar', 'atualizar', 'excluir')
  const [abaAtiva, setAbaAtiva] = useState("consultar");

  // 3. Função para renderizar o componente correto
  const renderizarConteudoAba = () => {
    switch (abaAtiva) {
      case "consultar":
        return <AlunoConsultar />;
      case "criar":
        return <AlunoCriar />;
      case "atualizar":
        return <AlunoAtualizar />;
      case "excluir":
        return <AlunoExcluir />;
      default:
        return <AlunoConsultar />;
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Alunos</h1>
      
      {/* 4. Os botões de navegação das Abas */}
      <div style={tabContainerStyle}>
        <button
          style={abaAtiva === "consultar" ? activeTabStyle : tabButtonStyle}
          onClick={() => setAbaAtiva("consultar")}
        >
          Consultar
        </button>
        <button
          style={abaAtiva === "criar" ? activeTabStyle : tabButtonStyle}
          onClick={() => setAbaAtiva("criar")}
        >
          Criar Novo
        </button>
        <button
          style={abaAtiva === "atualizar" ? activeTabStyle : tabButtonStyle}
          onClick={() => setAbaAtiva("atualizar")}
        >
          Atualizar
        </button>
        <button
          style={abaAtiva === "excluir" ? activeTabStyle : tabButtonStyle}
          onClick={() => setAbaAtiva("excluir")}
        >
          Excluir
        </button>
      </div>

      {/* 5. A área onde o conteúdo da aba ativa aparece */}
      <div>
        {renderizarConteudoAba()}
      </div>
    </div>
  );
}