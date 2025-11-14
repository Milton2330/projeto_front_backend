import { useState } from "react";
import { api } from "../services/api";

// --- Componente ---
export default function AlunoExcluir() {
  // --- Estados ---
  const [alunoId, setAlunoId] = useState(""); // O ID do aluno a ser excluído
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // --- Handlers ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    // Validação: O ID é obrigatório
    if (!alunoId) {
      setErro("O ID do Aluno é obrigatório para excluir.");
      setLoading(false);
      return;
    }

    try {
      // 1. Chamar a API DELETE (sem a barra final, como definido no seu @router)
      const res = await api.delete(`deletar-alunos/${alunoId}`);
      
      setSucesso(res.data.mensagem); // "Aluno... deletado com sucesso"
      setAlunoId(""); // Limpa o campo de ID
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.mensagem) {
        // Exibe erros do back-end (ex: "Aluno não encontrado.")
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao excluir aluno.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização (JSX) ---
  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Excluir Aluno</h4>
      <p>Digite o ID do aluno que deseja excluir permanentemente.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        
        <label>
          ID do Aluno (Obrigatório):
          <input
            type="number"
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
            placeholder="ID do aluno a ser excluído"
            required
            style={{ width: "100%", backgroundColor: "#0a0a04ff" }} // Destaca o ID
          />
        </label>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            marginTop: "10px", 
            padding: "10px", 
            backgroundColor: "#dc3545", // Vermelho para perigo
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Excluindo..." : "Excluir Aluno (Permanente)"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}