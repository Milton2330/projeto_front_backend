// src/components/EnderecoExcluir.tsx
import { useState } from "react";
import { api } from "../services/api";

export default function EnderecoExcluir() {
  const [enderecoId, setEnderecoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    if (!enderecoId) {
      setErro("O ID do Endereço é obrigatório para excluir.");
      setLoading(false);
      return;
    }

    try {
      // ajuste o nome da rota se no back for diferente
      const res = await api.delete(`deletar-endereco/${enderecoId}`);

      setSucesso(res.data.mensagem);
      setEnderecoId("");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else {
        setErro("Erro ao excluir endereço.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Excluir Endereço</h4>
      <p>Digite o ID do endereço que deseja excluir permanentemente.</p>

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
            placeholder="ID do endereço a ser excluído"
            required
            style={{ width: "100%", backgroundColor: "#0a0a04ff" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Excluindo..." : "Excluir Endereço (Permanente)"}
        </button>

        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}
