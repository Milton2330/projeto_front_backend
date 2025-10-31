// src/pages/AlunoConsultaPage.tsx
import AlunoConsulta from "../components/AlunoConsulta";

export default function AlunoConsultaPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Consulta de Aluno</h1>
      <p>Busque pelo nome para ver os detalhes, endereço e notas.</p>
      <hr style={{ margin: "20px 0" }} />
      <AlunoConsulta />
    </div>
  );
}