import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { ClienteForm } from "@/components/forms/ClienteForm";
import { clientesQuery, ordensQuery, useRemoverCliente } from "@/services/queries";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes · TechAssist" },
      { name: "description", content: "Cadastro e consulta de clientes da assistência técnica." },
      { property: "og:title", content: "Clientes · TechAssist" },
      { property: "og:description", content: "Cadastro e consulta de clientes." },
    ],
  }),
  ssr: false,
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(clientesQuery),
    context.queryClient.ensureQueryData(ordensQuery),
  ]),
  component: ClientesPage,
});

function ClientesPage() {
  const { data } = useSuspenseQuery(clientesQuery);
  const { data: ordens } = useSuspenseQuery(ordensQuery);
  const remover = useRemoverCliente();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const lista = data.filter((c) => `${c.nome} ${c.email} ${c.telefone}`.toLowerCase().includes(q.toLowerCase()));

  async function excluir(id: string) {
    if (ordens.some((ordem) => ordem.clienteId === id)) {
      toast.error("Este cliente possui ordens vinculadas. Exclua ou transfira as ordens antes.");
      return;
    }
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await remover.mutateAsync(id);
      toast.success("Cliente excluído.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o cliente.");
    }
  }

  return (
    <div>
      <PageHeader title="Clientes" description={`${data.length} clientes cadastrados`}
        action={<Button onClick={() => setOpen(true)}><Plus /> Novo cliente</Button>} />
      <Card className="shadow-card border-0 p-4">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar cliente..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="hidden md:table-cell">E-mail</TableHead><TableHead>Telefone</TableHead><TableHead className="hidden lg:table-cell">Documento</TableHead><TableHead className="w-16">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {lista.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{c.email}</TableCell>
                <TableCell>{c.telefone}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{c.documento}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" aria-label={`Excluir ${c.nome}`} disabled={remover.isPending} onClick={() => void excluir(c.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {lista.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Nenhum cliente encontrado.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Novo cliente</DialogTitle></DialogHeader>
          <ClienteForm onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
