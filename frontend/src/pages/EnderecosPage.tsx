// src/pages/EnderecosPage.tsx
import { useState } from "react";
import EnderecoConsultar from "../components/EnderecoConsultar";
import EnderecoCriar from "../components/EnderecoCriar";
import EnderecoAtualizar from "../components/EnderecoAtualizar";
import EnderecoExcluir from "../components/EnderecoExcluir";

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  borderBottom: "2px solid #ccc",
  marginBottom: "20px",
};

const tabButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  fontSize: "16px",
};

const activeTabStyle: React.CSSProperties = {
  ...tabButtonStyle,
  borderBottom: "3px solid blue",
  fontWeight: "bold",
};

export default function EnderecosPage() {
  const [abaAtiva, setAbaAtiva] =
    useState<"consultar" | "criar" | "atualizar" | "excluir">("consultar");

  const renderizarConteudoAba = () => {
    switch (abaAtiva) {
      case "consultar":
        return <EnderecoConsultar />;
      case "criar":
        return <EnderecoCriar />;
      case "atualizar":
        return <EnderecoAtualizar />;
      case "excluir":
        return <EnderecoExcluir />;
      default:
        return <EnderecoConsultar />;
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Endereços</h1>

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

      <div>{renderizarConteudoAba()}</div>
    </div>
  );
}
