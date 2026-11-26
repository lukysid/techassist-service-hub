import { http, useMock } from "./api-client";
import { delay, readDB, writeDB } from "./mock-store";
import type { OrdemInput, OrdemServico, StatusOrdem } from "./types";

export const ordensService = {
  async listar(): Promise<OrdemServico[]> {
    if (!useMock) return http<OrdemServico[]>("/ordens");
    return delay([...readDB().ordens]);
  },
  async criar(input: OrdemInput): Promise<OrdemServico> {
    if (!useMock) return http<OrdemServico>("/ordens", { method: "POST", body: JSON.stringify(input) });
    const db = readDB();
    const numero = Math.max(1000, ...db.ordens.map((o) => o.numero)) + 1;
    const nova: OrdemServico = { ...input, id: crypto.randomUUID(), numero, criadoEm: new Date().toISOString() };
    writeDB({ ...db, ordens: [nova, ...db.ordens] });
    return delay(nova);
  },
  async atualizarStatus(id: string, status: StatusOrdem): Promise<void> {
    if (!useMock) return http<void>(`/ordens/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    const db = readDB();
    writeDB({ ...db, ordens: db.ordens.map((o) => (o.id === id ? { ...o, status } : o)) });
    return delay(undefined);
  },
};
