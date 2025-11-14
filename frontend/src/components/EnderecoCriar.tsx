// src/components/EnderecoCriar.tsx
import { useState } from "react";
import { api } from "../services/api";

// Espelha o EnderecoCreateSchema:
// cep, endereco, bairro?, cidade, estado 
interface EnderecoCreateData {
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const estadoInicial: EnderecoCreateData = {
  cep: "",
  endereco: "",
  bairro: "",
  cidade: "",
  estado: "",
};

export default function EnderecoCriar() {
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

    if (!formData.cep || !formData.endereco || !formData.cidade || !formData.estado) {
      setErro("Preencha pelo menos CEP, endereço, cidade e estado.");
      setLoading(false);
      return;
    }

    const dadosParaEnviar = {
      cep: formData.cep,
      endereco: formData.endereco,
      bairro: formData.bairro || null,
      cidade: formData.cidade,
      estado: formData.estado,
    };

    try {
      // POST /inserir-endereco/
      const res = await api.post("inserir-endereco/", dadosParaEnviar);

      setSucesso(`Endereço criado com sucesso! (ID: ${res.data.id_criado})`);
      setFormData(estadoInicial);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao criar endereço.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: "20px", marginTop: "20px" }}>
      <h4>Criar Novo Endereço</h4>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}
      >
        <label>
          CEP:
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            placeholder="Ex: 12345-678"
            required
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Endereço:
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Bairro (Opcional):
          <input
            type="text"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Cidade:
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Estado:
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value.toUpperCase() }))}
            placeholder="Ex: SP, RJ..."
            maxLength={2}
            required
            style={{ width: "100%" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "10px", padding: "10px" }}
        >
          {loading ? "Salvando..." : "Salvar Novo Endereço"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
