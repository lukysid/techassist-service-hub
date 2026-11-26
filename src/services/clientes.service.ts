import { criarRegistro, excluirRegistro, listarRegistros, useMock } from "./api-client";
import { delay, readDB, writeDB } from "./mock-store";
import type { Cliente, ClienteInput } from "./types";

export const clientesService = {
  async listar(): Promise<Cliente[]> {
    if (!useMock) return listarRegistros<Cliente>("cliente");
    return delay([...readDB().clientes]);
  },

  async criar(input: ClienteInput): Promise<Cliente> {
    if (!useMock) {
      const agora = new Date().toISOString();
      return criarRegistro<Cliente>({ ...input, tipo: "cliente", criadoEm: agora });
    }

    const db = readDB();
    const novo: Cliente = { ...input, tipo: "cliente", id: crypto.randomUUID(), criadoEm: new Date().toISOString() };
    writeDB({ ...db, clientes: [novo, ...db.clientes] });
    return delay(novo);
  },

  async remover(id: string): Promise<void> {
    if (!useMock) return excluirRegistro(id);
    const db = readDB();
    writeDB({ ...db, clientes: db.clientes.filter((cliente) => cliente.id !== id) });
    return delay(undefined);
  },
};
