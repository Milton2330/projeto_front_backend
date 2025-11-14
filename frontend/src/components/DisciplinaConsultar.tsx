import { useState } from "react";
import { api } from "../services/api";

// --- Interfaces ---
// Esta interface deve espelhar o seu 'DisciplinaCompletaSchema' do Django
interface Disciplina {
  id: number;
  disciplina: string;
  carga: number;
  semestre: number;
}

// --- Componente ---
export default function DisciplinaConsultar() {
  // --- Estados ---
  const [resultados, setResultados] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para os campos de input
  const [buscaId, setBuscaId] = useState("");
  const [buscaSemestre, setBuscaSemestre] = useState("");

  // --- Funções de Busca (Handlers) ---

  // 1. Buscar TODAS
  const handleBuscarTodas = async () => {
    setLoading(true);
    setErro(null);
    setResultados([]); // Limpa resultados anteriores
    try {
      // Endpoint: /disciplinas
      const res = await api.get("disciplinas");
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro("Nenhuma disciplina encontrada.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar disciplinas.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Buscar por ID
  const handleBuscarPorId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaId) return;

    setLoading(true);
    setErro(null);
    setResultados([]);
    try {
      // Endpoint: /disciplina-por-id/{id}
      const res = await api.get(`disciplina-por-id/${buscaId}`);
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro(`Disciplina com ID ${buscaId} não encontrada.`);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar disciplina por ID.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Buscar por SEMESTRE
  const handleBuscarPorSemestre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaSemestre) return;

    setLoading(true);
    setErro(null);
    setResultados([]);
    try {
      // Endpoint: /disciplina-por-semestre/{semestre}
      const res = await api.get(`disciplina-por-semestre/${buscaSemestre}`);
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro(`Nenhuma disciplina encontrada para o ${buscaSemestre}º semestre.`);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar disciplina por semestre.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização (JSX) ---
  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Consultar Disciplinas</h4>
      
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

        {/* Formulário de Busca por Semestre */}
        <form onSubmit={handleBuscarPorSemestre}>
          <label>
            Buscar por Semestre:
            <input
              type="number"
              value={buscaSemestre}
              onChange={(e) => setBuscaSemestre(e.target.value)}
              placeholder="Digite o semestre"
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
          </label>
          <button type="submit" disabled={loading}>Buscar</button>
        </form>

        {/* Botão de Buscar Todos */}
        <button onClick={handleBuscarTodas} disabled={loading}>
          Listar Todas
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
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Disciplina</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Carga Horária</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Semestre</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((disciplina) => (
              <tr key={disciplina.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{disciplina.id}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{disciplina.disciplina}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{disciplina.carga}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{disciplina.semestre}º</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}