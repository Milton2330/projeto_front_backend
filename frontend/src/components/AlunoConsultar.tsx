import { useState } from "react";
import { api } from "../services/api"; // Nosso axios configurado

// --- Interfaces ---
// Esta interface deve espelhar o seu 'AlunosSchema' do Django
interface Aluno {
  id: number;
  matricula: string;
  nome: string;
  email?: string;
  nome_mae?: string;
  // O endpoint consultar-alunos/.values() também retorna 'endereco_id'
  endereco_id?: number; 
}

// --- Componente ---
export default function AlunoConsultar() {
  // --- Estados ---
  const [resultados, setResultados] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para os campos de input
  const [buscaId, setBuscaId] = useState("");
  const [buscaNome, setBuscaNome] = useState("");

  // --- Funções de Busca (Handlers) ---

  // 1. Buscar TODOS
  const handleBuscarTodos = async () => {
    setLoading(true);
    setErro(null);
    setResultados([]); // Limpa resultados anteriores
    try {
      const res = await api.get("consultar-alunos");
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro("Nenhum aluno encontrado.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar alunos.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Buscar por ID
  const handleBuscarPorId = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!buscaId) return; // Não faz nada se o campo estiver vazio

    setLoading(true);
    setErro(null);
    setResultados([]);
    try {
      const res = await api.get(`aluno-por-id/${buscaId}`);
      setResultados(res.data); // O endpoint retorna uma lista
      if (res.data.length === 0) {
        setErro(`Aluno com ID ${buscaId} não encontrado.`);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar aluno por ID.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Buscar por NOME
  const handleBuscarPorNome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaNome) return;

    setLoading(true);
    setErro(null);
    setResultados([]);
    try {
      const res = await api.get(`alunos-por-nome/${buscaNome}`);
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro(`Nenhum aluno encontrado com o nome "${buscaNome}".`);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar aluno por nome.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização (JSX) ---
  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Consultar Alunos</h4>
      
      {/* Container com os 3 formulários de busca */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        
        {/* Formulário de Busca por ID */}
        <form onSubmit={handleBuscarPorId}>
          <label>
            Buscar por ID:
            <input
              type="number"
              value={buscaId}
              onChange={(e) => setBuscaId(e.target.value)}
              placeholder="Digite o ID"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
          </label>
          <button type="submit" disabled={loading}>Buscar</button>
        </form>

        {/* Formulário de Busca por Nome */}
        <form onSubmit={handleBuscarPorNome}>
          <label>
            Buscar por Nome:
            <input
              type="text"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              placeholder="Digite o nome"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
          </label>
          <button type="submit" disabled={loading}>Buscar</button>
        </form>

        {/* Botão de Buscar Todos */}
        <button onClick={handleBuscarTodos} disabled={loading}>
          Listar Todos os Alunos
        </button>
      </div>

      <hr />

      {/* --- Área de Resultados --- */}
      <h4>Resultados</h4>
      {loading && <p>Carregando...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      
      {!loading && !erro && resultados.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Matrícula</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Nome</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>E-mail</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Mãe</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((aluno) => (
              <tr key={aluno.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{aluno.id}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{aluno.matricula}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{aluno.nome}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{aluno.email || "-"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{aluno.nome_mae || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}