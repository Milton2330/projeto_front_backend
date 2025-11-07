import { useState } from "react";
import { api } from "../services/api";

// --- Interface ---
// Define a "forma" dos dados do nosso formulário.
// Espelha o AlunoCreateSchema do Django.
interface AlunoCreateData {
  matricula: string;
  nome: string;
  email: string;
  endereco_id: string; // Começa como string no formulário
  nome_mae: string;
}

// Estado inicial vazio para o formulário
const estadoInicial: AlunoCreateData = {
  matricula: "",
  nome: "",
  email: "",
  endereco_id: "",
  nome_mae: "",
};

// --- Componente ---
export default function AlunoCriar() {
  // --- Estados ---
  const [formData, setFormData] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // --- Handlers ---

  // Função genérica para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    // Prepara os dados para enviar
    const dadosParaEnviar = {
      ...formData,
      // Converte 'endereco_id' para número.
      // Se estiver vazio, envia 'null'.
      endereco_id: formData.endereco_id ? Number(formData.endereco_id) : null,
    };

    try {
      // Chama a API POST (sem barra final, como aprendemos)
      const res = await api.post("inserir-aluno/", dadosParaEnviar);
      
      setSucesso(`Aluno criado com sucesso! (ID: ${res.data.id_criado})`);
      setFormData(estadoInicial); // Limpa o formulário
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao criar aluno.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização (JSX) ---
  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Criar Novo Aluno</h4>
      <p>Preencha os dados abaixo para cadastrar um novo aluno.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <label>
          Matrícula:
          <input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Nome Completo:
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Nome da Mãe:
          <input
            type="text"
            name="nome_mae"
            value={formData.nome_mae}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          ID do Endereço (Opcional):
          <input
            type="number"
            name="endereco_id"
            value={formData.endereco_id}
            onChange={handleChange}
            placeholder="Ex: 1, 2, 3..."
            style={{ width: "100%" }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "10px" }}>
          {loading ? "Salvando..." : "Salvar Novo Aluno"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}