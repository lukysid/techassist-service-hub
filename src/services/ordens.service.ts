import { atualizarRegistro, criarRegistro, excluirRegistro, listarRegistros, useMock } from "./api-client";
import { delay, readDB, writeDB } from "./mock-store";
import type { OrdemInput, OrdemServico, StatusOrdem } from "./types";

export const ordensService = {
  async listar(): Promise<OrdemServico[]> {
    if (!useMock) return listarRegistros<OrdemServico>("ordem");
    return delay([...readDB().ordens]);
  },

  async criar(input: OrdemInput): Promise<OrdemServico> {
    if (!useMock) {
      const existentes = await this.listar();
      const numero = Math.max(1000, ...existentes.map((ordem) => ordem.numero)) + 1;
      return criarRegistro<OrdemServico>({
        ...input,
        tipo: "ordem",
        numero,
        criadoEm: new Date().toISOString(),
      });
    }

    const db = readDB();
    const numero = Math.max(1000, ...db.ordens.map((ordem) => ordem.numero)) + 1;
    const nova: OrdemServico = {
      ...input,
      tipo: "ordem",
      id: crypto.randomUUID(),
      numero,
      criadoEm: new Date().toISOString(),
    };
    writeDB({ ...db, ordens: [nova, ...db.ordens] });
    return delay(nova);
  },

  async atualizarStatus(id: string, status: StatusOrdem): Promise<void> {
    if (!useMock) {
      await atualizarRegistro<OrdemServico>(id, { status });
      return;
    }
    const db = readDB();
    writeDB({
      ...db,
      ordens: db.ordens.map((ordem) => (ordem.id === id ? { ...ordem, status } : ordem)),
    });
    return delay(undefined);
  },

  async remover(id: string): Promise<void> {
    if (!useMock) return excluirRegistro(id);
    const db = readDB();
    writeDB({ ...db, ordens: db.ordens.filter((ordem) => ordem.id !== id) });
    return delay(undefined);
  },
};
