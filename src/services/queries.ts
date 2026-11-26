import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "./clientes.service";
import { ordensService } from "./ordens.service";
import type { ClienteInput, OrdemInput, StatusOrdem } from "./types";

export const clientesQuery = queryOptions({ queryKey: ["clientes"], queryFn: clientesService.listar });
export const ordensQuery = queryOptions({ queryKey: ["ordens"], queryFn: ordensService.listar });

export function useCriarCliente() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (i: ClienteInput) => clientesService.criar(i), onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"] }) });
}
export function useCriarOrdem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (i: OrdemInput) => ordensService.criar(i), onSuccess: () => qc.invalidateQueries({ queryKey: ["ordens"] }) });
}
export function useAtualizarStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (v: { id: string; status: StatusOrdem }) => ordensService.atualizarStatus(v.id, v.status), onSuccess: () => qc.invalidateQueries({ queryKey: ["ordens"] }) });
}
