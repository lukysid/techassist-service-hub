import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { OrdemForm } from "@/components/forms/OrdemForm";
import { clientesQuery, ordensQuery, useAtualizarStatus } from "@/services/queries";
import { STATUS_LABEL, type StatusOrdem } from "@/services/types";

export const Route = createFileRoute("/ordens")({
  head: () => ({
    meta: [
      { title: "Ordens de serviço · TechAssist" },
      { name: "description", content: "Abertura e acompanhamento de ordens de serviço." },
      { property: "og:title", content: "Ordens de serviço · TechAssist" },
      { property: "og:description", content: "Abertura e acompanhamento de ordens de serviço." },
    ],
  }),
  ssr: false,
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(clientesQuery), context.queryClient.ensureQueryData(ordensQuery)]),
  component: OrdensPage,
});

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function OrdensPage() {
  const { data: ordens } = useSuspenseQuery(ordensQuery);
  const { data: clientes } = useSuspenseQuery(clientesQuery);
  const atualizar = useAtualizarStatus();
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("todas");
  const lista = ordens.filter((o) => filtro === "todas" || (filtro === "abertas" ? o.status !== "finalizada" : o.status === "finalizada"));
  const nome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? "—";

  return (
    <div>
      <PageHeader title="Ordens de serviço" description="Acompanhe os atendimentos da bancada"
        action={<Button onClick={() => setOpen(true)}><Plus /> Nova ordem</Button>} />
      <Card className="shadow-card border-0 p-4">
        <Tabs value={filtro} onValueChange={setFiltro} className="mb-4">
          <TabsList><TabsTrigger value="todas">Todas</TabsTrigger><TabsTrigger value="abertas">Abertas</TabsTrigger><TabsTrigger value="finalizadas">Finalizadas</TabsTrigger></TabsList>
        </Tabs>
        <Table>
          <TableHeader><TableRow><TableHead>Nº</TableHead><TableHead>Equipamento</TableHead><TableHead className="hidden md:table-cell">Cliente</TableHead><TableHead className="hidden lg:table-cell">Valor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {lista.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-semibold text-primary">#{o.numero}</TableCell>
                <TableCell><p className="font-medium">{o.equipamento} {o.marcaModelo}</p><p className="max-w-xs truncate text-xs text-muted-foreground">{o.defeito}</p></TableCell>
                <TableCell className="hidden md:table-cell">{nome(o.clienteId)}</TableCell>
                <TableCell className="hidden lg:table-cell">{brl.format(o.valorEstimado)}</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => atualizar.mutate({ id: o.id, status: v as StatusOrdem })}>
                    <SelectTrigger className="h-auto w-auto border-0 p-0 shadow-none"><StatusBadge status={o.status} /></SelectTrigger>
                    <SelectContent>{Object.entries(STATUS_LABEL).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {lista.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Nenhuma ordem encontrada.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Nova ordem de serviço</DialogTitle></DialogHeader>
          <OrdemForm onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
