import { http, useMock } from "./api-client";
import { delay, readDB, writeDB } from "./mock-store";
import type { Cliente, ClienteInput } from "./types";

export const clientesService = {
  async listar(): Promise<Cliente[]> {
    if (!useMock) return http<Cliente[]>("/clientes");
    return delay([...readDB().clientes]);
  },
  async criar(input: ClienteInput): Promise<Cliente> {
    if (!useMock) return http<Cliente>("/clientes", { method: "POST", body: JSON.stringify(input) });
    const db = readDB();
    const novo: Cliente = { ...input, id: crypto.randomUUID(), criadoEm: new Date().toISOString() };
    writeDB({ ...db, clientes: [novo, ...db.clientes] });
    return delay(novo);
  },
  async remover(id: string): Promise<void> {
    if (!useMock) return http<void>(`/clientes/${id}`, { method: "DELETE" });
    const db = readDB();
    writeDB({ ...db, clientes: db.clientes.filter((c) => c.id !== id) });
    return delay(undefined);
  },
};
