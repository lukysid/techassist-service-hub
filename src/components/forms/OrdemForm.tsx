import { useState, type FormEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientesQuery, useCriarOrdem } from "@/services/queries";
import { STATUS_LABEL, type StatusOrdem } from "@/services/types";

const schema = z.object({
  clienteId: z.string().min(1, "Selecione o cliente"),
  equipamento: z.string().trim().min(2, "Informe o equipamento").max(60),
  marcaModelo: z.string().trim().max(100),
  defeito: z.string().trim().min(3, "Descreva o defeito").max(1000),
  status: z.enum(["aberta", "em_andamento", "aguardando_peca", "finalizada"]),
  valorEstimado: z.coerce.number().min(0, "Valor inválido"),
});

export function OrdemForm({ onDone }: { onDone: () => void }) {
  const { data: clientes } = useSuspenseQuery(clientesQuery);
  const criar = useCriarOrdem();
  const [clienteId, setClienteId] = useState("");
  const [status, setStatus] = useState<StatusOrdem>("aberta");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = schema.safeParse({ ...Object.fromEntries(new FormData(e.currentTarget)), clienteId, status });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    try {
      await criar.mutateAsync(r.data);
      toast.success("Ordem de serviço criada");
      onDone();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a ordem de serviço.");
    }
  }
  const err = (k: string) => (errors[k] ? <p className="text-xs text-destructive">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label>Cliente</Label>
        <Select value={clienteId} onValueChange={setClienteId}>
          <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
          <SelectContent>{clientes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
        </Select>
        {err("clienteId")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5"><Label htmlFor="equipamento">Equipamento</Label><Input id="equipamento" name="equipamento" placeholder="Notebook, Desktop..." />{err("equipamento")}</div>
        <div className="space-y-1.5"><Label htmlFor="marcaModelo">Marca / modelo</Label><Input id="marcaModelo" name="marcaModelo" /></div>
      </div>
      <div className="space-y-1.5"><Label htmlFor="defeito">Defeito relatado</Label><Textarea id="defeito" name="defeito" rows={3} />{err("defeito")}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusOrdem)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(STATUS_LABEL).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label htmlFor="valorEstimado">Valor estimado (R$)</Label><Input id="valorEstimado" name="valorEstimado" type="number" step="0.01" defaultValue="0" />{err("valorEstimado")}</div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit" disabled={criar.isPending}>Criar ordem</Button>
      </div>
    </form>
  );
}
