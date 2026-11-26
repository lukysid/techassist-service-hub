import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "./clientes.service";
import { ordensService } from "./ordens.service";
import type { ClienteInput, OrdemInput, StatusOrdem } from "./types";

export const clientesQuery = queryOptions({
  queryKey: ["clientes"],
  queryFn: clientesService.listar,
});

export const ordensQuery = queryOptions({
  queryKey: ["ordens"],
  queryFn: ordensService.listar,
});

export function useCriarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ClienteInput) => clientesService.criar(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });
}

export function useRemoverCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientesService.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });
}

export function useCriarOrdem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OrdemInput) => ordensService.criar(input),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["ordens"] }),
      queryClient.invalidateQueries({ queryKey: ["clientes"] }),
    ]),
  });
}

export function useAtualizarStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: { id: string; status: StatusOrdem }) =>
      ordensService.atualizarStatus(value.id, value.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ordens"] }),
  });
}

export function useRemoverOrdem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordensService.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ordens"] }),
  });
}
