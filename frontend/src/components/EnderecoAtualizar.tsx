// src/components/EnderecoAtualizar.tsx
import { useState } from "react";
import { api } from "../services/api";

// Campos baseados no EnderecoUpdateSchema (todos opcionais) 
interface EnderecoUpdateData {
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  regiao: string;
}

const estadoInicial: EnderecoUpdateData = {
  cep: "",
  endereco: "",
  bairro: "",
  cidade: "",
  estado: "",
  regiao: "",
};

export default function EnderecoAtualizar() {
  const [enderecoId, setEnderecoId] = useState(""); // ID obrigatório
  const [formData, setFormData] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    // ID obrigatório
    if (!enderecoId) {
      setErro("O ID do Endereço é obrigatório para atualizar.");
      setLoading(false);
      return;
    }

    // Monta payload dinâmico: só envia o que foi preenchido
    const payload: { [key: string]: any } = {};

    if (formData.cep) payload.cep = formData.cep;
    if (formData.endereco) payload.endereco = formData.endereco;
    if (formData.bairro) payload.bairro = formData.bairro;
    if (formData.cidade) payload.cidade = formData.cidade;
    if (formData.estado) payload.estado = formData.estado.toUpperCase();
    if (formData.regiao) payload.regiao = formData.regiao;

    if (Object.keys(payload).length === 0) {
      setErro("Preencha pelo menos um campo para atualizar.");
      setLoading(false);
      return;
    }

    try {
      // Rota do backend: PUT /atualizar-enderecos/{endereco_id} 
      const res = await api.put(
        `atualizar-enderecos/${enderecoId}`,
        payload
      );

      setSucesso(res.data.mensagem); // "Endereço atualizado com sucesso"
      setFormData(estadoInicial);
      setEnderecoId("");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao atualizar endereço.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Atualizar Endereço</h4>
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
          ID do Endereço (Obrigatório):
          <input
            type="number"
            value={enderecoId}
            onChange={(e) => setEnderecoId(e.target.value)}
            required
            placeholder="ID do endereço a ser atualizado"
            style={{ width: "100%", backgroundColor: "#0c0c04ff" }}
          />
        </label>

        <hr />

        <p>Campos para atualizar (opcionais):</p>

        <label>
          Novo CEP:
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            placeholder="Ex: 12345-678"
          />
        </label>

        <label>
          Novo Endereço:
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
          />
        </label>

        <label>
          Novo Bairro:
          <input
            type="text"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
          />
        </label>

        <label>
          Nova Cidade:
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
          />
        </label>

        <label>
          Novo Estado:
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estado: e.target.value.toUpperCase(),
              }))
            }
            maxLength={2}
            placeholder="UF (SP, RJ...)"
          />
        </label>

        <label>
          Nova Região:
          <input
            type="text"
            name="regiao"
            value={formData.regiao}
            onChange={handleChange}
            placeholder="Ex: Sudeste"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "10px", padding: "10px" }}
        >
          {loading ? "Atualizando..." : "Atualizar Endereço"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
