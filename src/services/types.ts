export interface Cliente {
  id: string;
  tipo?: "cliente";
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  endereco: string;
  criadoEm: string;
}
export type ClienteInput = Omit<Cliente, "id" | "criadoEm" | "tipo">;

export type StatusOrdem = "aberta" | "em_andamento" | "aguardando_peca" | "finalizada";
export interface OrdemServico {
  id: string;
  tipo?: "ordem";
  numero: number;
  clienteId: string;
  equipamento: string;
  marcaModelo: string;
  defeito: string;
  status: StatusOrdem;
  valorEstimado: number;
  criadoEm: string;
}
export type OrdemInput = Omit<OrdemServico, "id" | "numero" | "criadoEm" | "tipo">;

export const STATUS_LABEL: Record<StatusOrdem, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  aguardando_peca: "Aguardando peça",
  finalizada: "Finalizada",
};
