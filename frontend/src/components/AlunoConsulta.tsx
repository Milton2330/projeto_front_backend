// src/components/AlunoConsulta.tsx
import { useState } from "react";
import { api } from "../services/api";

// --- Interfaces (Tipos) ---
// Precisamos espelhar os schemas de SAÍDA do Django
interface Endereco {
  cep: string;
  endereco: string;
  bairro?: string;
  cidade: string;
  estado: string;
}

interface DisciplinaNota {
  disciplina_nome: string;
  carga: number;
  semestre: number;
  nota?: number | null; // A nota pode ser nula
}

interface AlunoDetalhe {
  id: number;
  matricula: string;
  nome: string;
  email?: string;
  nome_mae?: string;
  endereco?: Endereco; // Endereço pode ser nulo
  matriculas: DisciplinaNota[]; // Lista de matrículas
}

// --- Componente ---

export default function AlunoConsulta() {
  const [nomeBusca, setNomeBusca] = useState("");
  const [resultados, setResultados] = useState<AlunoDetalhe[]>([]); // Um array de alunos
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeBusca.trim()) {
      setErro("Digite um nome para buscar.");
      return;
    }

    setLoading(true);
    setErro(null);
    setResultados([]);

    try {
      // Usamos o novo endpoint do Passo 6
      const res = await api.get(`/aluno-detalhe-por-nome/${nomeBusca}`);
      
      if (res.data.length === 0) {
        setErro("Nenhum aluno encontrado com esse nome.");
      } else {
        setResultados(res.data);
      }
    } catch (err: any) {
      console.error(err);
      setErro("Erro ao conectar com a API. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      {/* Formulário de Busca */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={nomeBusca}
          onChange={(e) => setNomeBusca(e.target.value)}
          placeholder="Digite o nome do aluno"
          style={{ flex: 1, padding: "8px" }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: "8px" }}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Exibição de Erros */}
      {erro && <p style={{ color: "red", marginTop: "15px" }}>{erro}</p>}

      {/* Container de Resultados */}
      <div style={{ marginTop: "20px" }}>
        {resultados.map((aluno) => (
          // Card de cada aluno
          <div key={aluno.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
            
            <h3>{aluno.nome}</h3>
            <p>Matrícula: {aluno.matricula} | E-mail: {aluno.email || "-"}</p>
            <p>Mãe: {aluno.nome_mae || "-"}</p>
            
            <hr style={{ margin: "15px 0" }} />

            {/* Endereço */}
            <h4>Endereço</h4>
            {aluno.endereco ? (
              <div>
                <p>{aluno.endereco.endereco}, {aluno.endereco.bairro}</p>
                <p>{aluno.endereco.cidade} - {aluno.endereco.estado} | CEP: {aluno.endereco.cep}</p>
              </div>
            ) : (
              <p>Endereço não cadastrado.</p>
            )}

            <hr style={{ margin: "15px 0" }} />

            {/* Matérias e Notas */}
            <h4>Disciplinas Matriculadas</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Disciplina</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nota</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Semestre</th>
                </tr>
              </thead>
              <tbody>
                {aluno.matriculas.map((mat) => (
                  <tr key={mat.disciplina_nome}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{mat.disciplina_nome}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {/* Se a nota for nula, exibe "-" */}
                      {mat.nota !== null ? mat.nota : "-"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{mat.semestre}º</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}