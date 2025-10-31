// src/components/AlunoForm.tsx
import { useState, useEffect } from "react";
import { api } from "../services/api";

// --- Interfaces ---

// Interface para a Disciplina (vinda do GET /disciplinas)
interface Disciplina {
  id: number;
  disciplina: string;
}

// Interface para o formulário (espelha o AlunoCreateSchema)
interface AlunoFormData {
  matricula: string;
  nome: string;
  email: string;
  nome_mae: string;
  // Objeto aninhado para o endereço
  endereco_info: {
    cep: string;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  // Array de IDs das disciplinas
  disciplinas_ids: number[];
}

// Estado inicial vazio para o formulário
const estadoInicial: AlunoFormData = {
  matricula: "",
  nome: "",
  email: "",
  nome_mae: "",
  endereco_info: {
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
  },
  disciplinas_ids: [],
};

// --- Componente ---

export default function AlunoForm() {
  const [formData, setFormData] = useState<AlunoFormData>(estadoInicial);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [sucessoApi, setSucessoApi] = useState<string | null>(null);

  // Efeito para buscar as disciplinas quando o componente carregar
  useEffect(() => {
    async function fetchDisciplinas() {
      try {
        const res = await api.get("/disciplinas");
        setDisciplinas(res.data);
      } catch (err) {
        console.error(err);
        setErroApi("Erro ao carregar lista de disciplinas.");
      }
    }
    fetchDisciplinas();
  }, []); // O array vazio [] significa que isso roda só 1 vez

  // --- Manipuladores de Mudança ---

  // Manipulador para campos simples (matricula, nome, email, nome_mae)
  const handleChangeAluno = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manipulador para os campos aninhados de endereço
  const handleChangeEndereco = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      endereco_info: {
        ...prev.endereco_info,
        [name]: value,
      },
    }));
  };

  // Manipulador para os checkboxes de disciplinas
  const handleSelectDisciplina = (idDisciplina: number) => {
    setFormData((prev) => {
      const jaSelecionado = prev.disciplinas_ids.includes(idDisciplina);
      let novosIds: number[];

      if (jaSelecionado) {
        // Se já estava marcado, remove
        novosIds = prev.disciplinas_ids.filter((id) => id !== idDisciplina);
      } else {
        // Se não estava marcado, adiciona
        novosIds = [...prev.disciplinas_ids, idDisciplina];
      }
      
      return { ...prev, disciplinas_ids: novosIds };
    });
  };

  // --- Manipulador de Envio ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErroApi(null);
    setSucessoApi(null);

    // Validação simples
    if (formData.disciplinas_ids.length === 0) {
      setErroApi("Selecione pelo menos uma disciplina.");
      setLoading(false);
      return;
    }

    try {
      // Envia o objeto 'formData' inteiro.
      // O Axios e o Ninja cuidam da serialização.
      const res = await api.post("/inserir-aluno/", formData);
      setSucessoApi(res.data.mensagem);
      setFormData(estadoInicial); // Limpa o formulário
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.mensagem) {
        setErroApi(err.response.data.mensagem);
      } else {
        setErroApi("Erro desconhecido ao cadastrar aluno.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização (JSX) ---

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Dados Pessoais</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="matricula" value={formData.matricula} onChange={handleChangeAluno} placeholder="Matrícula" required />
        <input name="nome" value={formData.nome} onChange={handleChangeAluno} placeholder="Nome Completo" required />
        <input name="email" value={formData.email} onChange={handleChangeAluno} placeholder="E-mail" type="email" />
        <input name="nome_mae" value={formData.nome_mae} onChange={handleChangeAluno} placeholder="Nome da Mãe" />
      </div>

      <h2 style={{ marginTop: "20px" }}>Endereço</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="cep" value={formData.endereco_info.cep} onChange={handleChangeEndereco} placeholder="CEP" required />
        <input name="endereco" value={formData.endereco_info.endereco} onChange={handleChangeEndereco} placeholder="Endereço (Rua, Av, etc.)" required />
        <input name="bairro" value={formData.endereco_info.bairro} onChange={handleChangeEndereco} placeholder="Bairro" />
        <input name="cidade" value={formData.endereco_info.cidade} onChange={handleChangeEndereco} placeholder="Cidade" required />
        <input name="estado" value={formData.endereco_info.estado} onChange={handleChangeEndereco} placeholder="Estado (Ex: SP)" required />
      </div>

      <h2 style={{ marginTop: "20px" }}>Disciplinas</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {disciplinas.length === 0 && <p>Carregando disciplinas...</p>}
        {disciplinas.map((disc) => (
          <label key={disc.id}>
            <input
              type="checkbox"
              checked={formData.disciplinas_ids.includes(disc.id)}
              onChange={() => handleSelectDisciplina(disc.id)}
            />
            {disc.disciplina}
          </label>
        ))}
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: "20px", padding: "10px" }}>
        {loading ? "Salvando..." : "Salvar Cadastro"}
      </button>

      {sucessoApi && <p style={{ color: "green", marginTop: "10px" }}>{sucessoApi}</p>}
      {erroApi && <p style={{ color: "red", marginTop: "10px" }}>{erroApi}</p>}
    </form>
  );
}