import AlunoForm from "../components/AlunoForm";

export default function AlunoCadastroPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Cadastro de Novo Aluno</h1>
      <p>Preencha todos os dados abaixo para matricular o aluno.</p>
      <hr style={{ margin: "20px 0" }} />
      <AlunoForm />
    </div>
  );
}