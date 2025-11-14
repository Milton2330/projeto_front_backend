// src/components/DisciplinaCriar.tsx
import { useState } from "react";
import { api } from "../services/api";

// Interface espelhando o DisciplinaCreateSchema do backend
// (disciplina: str, carga: int, semestre: int) :contentReference[oaicite:1]{index=1}
interface DisciplinaCreateData {
  disciplina: string;
  carga: string;    // string no formulário, convertemos para número
  semestre: string; // string no formulário, convertemos para número
}

const estadoInicial: DisciplinaCreateData = {
  disciplina: "",
  carga: "",
  semestre: "",
};

export default function DisciplinaCriar() {
  const [formData, setFormData] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Atualiza os campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Envia o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    // Validação simples
    if (!formData.disciplina || !formData.carga || !formData.semestre) {
      setErro("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    // Prepara dados para o backend
    const dadosParaEnviar = {
      disciplina: formData.disciplina,
      carga: Number(formData.carga),
      semestre: Number(formData.semestre),
    };

    try {
      // Usa o endpoint do backend: POST /inserir-disciplina/ :contentReference[oaicite:2]{index=2}
      const res = await api.post("inserir-disciplina/", dadosParaEnviar);

      setSucesso(`Disciplina criada com sucesso! (ID: ${res.data.id_criado})`);
      setFormData(estadoInicial); // limpa o formulário
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao criar disciplina.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Criar Nova Disciplina</h4>
      <p>Preencha os dados abaixo para cadastrar uma nova disciplina.</p>

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
          Nome da Disciplina:
          <input
            type="text"
            name="disciplina"
            value={formData.disciplina}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Carga Horária (em horas):
          <input
            type="number"
            name="carga"
            value={formData.carga}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Semestre:
          <input
            type="number"
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "10px", padding: "10px" }}
        >
          {loading ? "Salvando..." : "Salvar Nova Disciplina"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
