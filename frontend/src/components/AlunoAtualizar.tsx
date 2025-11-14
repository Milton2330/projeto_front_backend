import { useState } from "react";
import { api } from "../services/api";

interface AlunoUpdateData {
  aluno_id: string; // O ID do aluno que queremos atualizar
  matricula: string;
  nome: string;
  email: string;
  endereco_id: string;
  nome_mae: string;
}

// Estado inicial vazio
const estadoInicial: AlunoUpdateData = {
  aluno_id: "",
  matricula: "",
  nome: "",
  email: "",
  endereco_id: "",
  nome_mae: "",
};

// --- Componente ---
export default function AlunoAtualizar() {
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

    // Validação: O ID do aluno é obrigatório
    if (!formData.aluno_id) {
      setErro("O ID do Aluno é obrigatório para atualizar.");
      setLoading(false);
      return;
    }

    // 1. Criar o 'payload' dinâmico
    // Isso é crucial para bater com o 'exclude_unset=True' do back-end
    const payload: { [key: string]: string | number | null } = {};

    if (formData.matricula) payload.matricula = formData.matricula;
    if (formData.nome) payload.nome = formData.nome;
    if (formData.email) payload.email = formData.email;
    if (formData.nome_mae) payload.nome_mae = formData.nome_mae;
    
    // Trata o 'endereco_id'
    if (formData.endereco_id) {
      payload.endereco_id = Number(formData.endereco_id);
    } else if (formData.endereco_id === "") { 
      // Se o usuário apagar o campo, podemos enviar 'null'
      payload.endereco_id = null;
    }

    // Validação: Não enviar um payload vazio
    if (Object.keys(payload).length === 0) {
      setErro("Preencha pelo menos um campo para atualizar (ex: nome, email).");
      setLoading(false);
      return;
    }

    try {
      // 2. Chamar a API PUT (com a barra final, como no 'inserir')
      const res = await api.put(`atualizar-aluno/${formData.aluno_id}`, payload);
      
      setSucesso(res.data.mensagem); // "Aluno atualizado com sucesso"
      setFormData(estadoInicial); // Limpa o formulário
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.mensagem) {
        // Exibe erros do back-end (ex: "Aluno não encontrado.")
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao atualizar aluno.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização (JSX) ---
  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Atualizar Aluno</h4>
      <p>Digite o ID do aluno que deseja atualizar e preencha **apenas** os campos que deseja alterar.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        
        <label>
          ID do Aluno (Obrigatório):
          <input
            type="number"
            name="aluno_id"
            value={formData.aluno_id}
            onChange={handleChange}
            placeholder="ID do aluno a ser atualizado"
            required
            style={{ width: "100%", backgroundColor: "#0c0c04ff" }} // Destaca o ID
          />
        </label>

        <hr style={{ margin: "10px 0" }} />
        <p>Campos para atualizar (opcionais):</p>

        <label>
          Nova Matrícula:
          <input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Novo Nome:
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Novo E-mail:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Novo Nome da Mãe:
          <input
            type="text"
            name="nome_mae"
            value={formData.nome_mae}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Novo ID do Endereço:
          <input
            type="number"
            name="endereco_id"
            value={formData.endereco_id}
            onChange={handleChange}
            placeholder="(Deixe em branco para não alterar)"
            style={{ width: "100%" }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "10px" }}>
          {loading ? "Atualizando..." : "Atualizar Aluno"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}