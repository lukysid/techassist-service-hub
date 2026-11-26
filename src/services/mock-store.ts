import type { Cliente, OrdemServico } from "./types";

const KEY = "techassist-db-v1";
interface DB { clientes: Cliente[]; ordens: OrdemServico[] }

const seed: DB = {
  clientes: [
    { id: "c1", nome: "Mariana Souza", email: "mariana@email.com", telefone: "(11) 98765-4321", documento: "123.456.789-00", endereco: "Rua das Flores, 120 - São Paulo", criadoEm: "2026-10-02T10:00:00Z" },
    { id: "c2", nome: "Carlos Pereira", email: "carlos@empresa.com.br", telefone: "(11) 99654-1122", documento: "12.345.678/0001-90", endereco: "Av. Paulista, 1500 - São Paulo", criadoEm: "2026-10-15T14:30:00Z" },
    { id: "c3", nome: "Fernanda Lima", email: "fernanda.lima@email.com", telefone: "(21) 97777-3344", documento: "987.654.321-00", endereco: "Rua Voluntários, 45 - Rio de Janeiro", criadoEm: "2026-11-05T09:15:00Z" },
  ],
  ordens: [
    { id: "o1", numero: 1001, clienteId: "c1", equipamento: "Notebook", marcaModelo: "Dell Inspiron 15", defeito: "Não liga, possível problema na fonte", status: "em_andamento", valorEstimado: 280, criadoEm: "2026-11-10T10:00:00Z" },
    { id: "o2", numero: 1002, clienteId: "c2", equipamento: "Desktop", marcaModelo: "Montado - i5 10ª", defeito: "Formatação e backup", status: "finalizada", valorEstimado: 150, criadoEm: "2026-11-12T11:00:00Z" },
    { id: "o3", numero: 1003, clienteId: "c3", equipamento: "Impressora", marcaModelo: "HP DeskJet 2774", defeito: "Atolamento de papel", status: "aberta", valorEstimado: 90, criadoEm: "2026-11-20T16:00:00Z" },
    { id: "o4", numero: 1004, clienteId: "c1", equipamento: "Notebook", marcaModelo: "Lenovo IdeaPad 3", defeito: "Tela quebrada", status: "aguardando_peca", valorEstimado: 520, criadoEm: "2026-11-22T13:00:00Z" },
  ],
};

let memory: DB | null = null;
export function readDB(): DB {
  if (memory) return memory;
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? (JSON.parse(raw) as DB) : structuredClone(seed);
  } else return structuredClone(seed);
  return memory;
}
export function writeDB(db: DB) {
  memory = db;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(db));
}
export const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 150));
