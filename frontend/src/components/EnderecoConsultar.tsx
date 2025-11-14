// src/components/EnderecoConsultar.tsx
import { useState } from "react";
import { api } from "../services/api";

// Interface baseada no schema de endereços do backend
interface Endereco {
  id: number;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  regiao?: string;
}

export default function EnderecoConsultar() {
  const [resultados, setResultados] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [buscaId, setBuscaId] = useState("");
  const [buscaEstado, setBuscaEstado] = useState("");

  // Buscar por ID
  const handleBuscarPorId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaId) return;

    setLoading(true);
    setErro(null);
    setResultados([]);

    try {
      // GET /enderecos-por-id/{id}
      const res = await api.get(`enderecos-por-id/${buscaId}`);
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro(`Nenhum endereço encontrado com ID ${buscaId}.`);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar endereço por ID.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar por ESTADO
  const handleBuscarPorEstado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaEstado) return;

    setLoading(true);
    setErro(null);
    setResultados([]);

    try {
      // GET /enderecos-por-estado/{estado}
      const res = await api.get(`enderecos-por-estado/${buscaEstado}`);
      setResultados(res.data);
      if (res.data.length === 0) {
        setErro(`Nenhum endereço encontrado para o estado "${buscaEstado}".`);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar endereços por estado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: "20px" }}>
      <h4>Consultar Endereços</h4>

      {/* Formulários de busca */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Buscar por ID */}
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
          <button type="submit" disabled={loading}>
            Buscar
          </button>
        </form>

        {/* Buscar por Estado */}
        <form onSubmit={handleBuscarPorEstado}>
          <label>
            Buscar por Estado:
            <input
              type="text"
              value={buscaEstado}
              onChange={(e) => setBuscaEstado(e.target.value.toUpperCase())}
              placeholder="Ex: SP, RJ..."
              maxLength={2}
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
          </label>
          <button type="submit" disabled={loading}>
            Buscar
          </button>
        </form>
      </div>

      <hr />

      {/* Resultados */}
      <h4>Resultados</h4>
      {loading && <p>Carregando...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!loading && !erro && resultados.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>CEP</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Logradouro
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Bairro
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Cidade
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Estado
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Região
              </th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((endereco) => (
              <tr key={endereco.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.cep}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.endereco}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.bairro}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.cidade}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.estado}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {endereco.regiao || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
