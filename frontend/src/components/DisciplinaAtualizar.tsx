// src/components/DisciplinaAtualizar.tsx
import { useState } from "react";
import { api } from "../services/api";

// Interface baseada no DisciplinaUpdateSchema do backend
// (todos os campos opcionais: disciplina, carga, semestre)
interface DisciplinaUpdateData {
  disciplina: string;
  carga: string;
  semestre: string;
}

// Estado inicial
const estadoInicial: DisciplinaUpdateData = {
  disciplina: "",
  carga: "",
  semestre: "",
};

export default function DisciplinaAtualizar() {
  const [disciplinaId, setDisciplinaId] = useState(""); // ID obrigatório
  const [formData, setFormData] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Atualização de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    // Validação: ID obrigatório
    if (!disciplinaId) {
      setErro("O ID da Disciplina é obrigatório para atualizar.");
      setLoading(false);
      return;
    }

    // Criar payload dinâmico (somente campos preenchidos)
    const payload: { [key: string]: any } = {};

    if (formData.disciplina) payload.disciplina = formData.disciplina;
    if (formData.carga) payload.carga = Number(formData.carga);
    if (formData.semestre) payload.semestre = Number(formData.semestre);

    // Se o payload estiver vazio, não faz nada
    if (Object.keys(payload).length === 0) {
      setErro("Preencha ao menos um campo para atualizar.");
      setLoading(false);
      return;
    }

    try {
      // Endpoint do backend: PUT /atualizar-disciplina/{id}/
      const res = await api.put(
        `atualizar-disciplina/${disciplinaId}`,
        payload
      );

      setSucesso(res.data.mensagem);
      setFormData(estadoInicial);
      setDisciplinaId("");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao atualizar disciplina.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Atualizar Disciplina</h4>
      <p>Informe o ID e preencha apenas os campos que deseja alterar.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <label>
          ID da Disciplina (Obrigatório):
          <input
            type="number"
            value={disciplinaId}
            onChange={(e) => setDisciplinaId(e.target.value)}
            required
            style={{ width: "100%", backgroundColor: "#0c0c04ff" }}
          />
        </label>

        <hr />

        <label>
          Novo Nome da Disciplina:
          <input
            type="text"
            name="disciplina"
            value={formData.disciplina}
            onChange={handleChange}
          />
        </label>

        <label>
          Nova Carga Horária:
          <input
            type="number"
            name="carga"
            value={formData.carga}
            onChange={handleChange}
          />
        </label>

        <label>
          Novo Semestre:
          <input
            type="number"
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "10px", padding: "10px" }}
        >
          {loading ? "Atualizando..." : "Atualizar Disciplina"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
