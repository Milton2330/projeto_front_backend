import { useState } from "react";

// 1. Importe os 4 novos componentes de Disciplina
import DisciplinaConsultar from "../components/DisciplinaConsultar";
import DisciplinaCriar from "../components/DisciplinaCriar";
import DisciplinaAtualizar from "../components/DisciplinaAtualizar";
import DisciplinaExcluir from "../components/DisciplinaExcluir";

// Vamos reutilizar os mesmos estilos de abas da outra página
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

const activeTabStyle = {
  ...tabButtonStyle,
  borderBottom: "3px solid blue",
  fontWeight: "bold",
};


export default function DisciplinasPage() {
  // 2. Estado para controlar a aba ativa
  const [abaAtiva, setAbaAtiva] = useState("consultar");

  // 3. Função para renderizar o componente correto
  const renderizarConteudoAba = () => {
    switch (abaAtiva) {
      case "consultar":
        return <DisciplinaConsultar />;
      case "criar":
        return <DisciplinaCriar />;
      case "atualizar":
        return <DisciplinaAtualizar />;
      case "excluir":
        return <DisciplinaExcluir />;
      default:
        return <DisciplinaConsultar />;
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Disciplinas</h1>
      
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
          Criar Nova
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