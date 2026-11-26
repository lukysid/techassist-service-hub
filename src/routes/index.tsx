import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Users, ClipboardList, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { clientesQuery, ordensQuery } from "@/services/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · TechAssist" },
      { name: "description", content: "Visão geral de clientes e ordens de serviço da assistência técnica." },
      { property: "og:title", content: "Dashboard · TechAssist" },
      { property: "og:description", content: "Visão geral de clientes e ordens de serviço." },
    ],
  }),
  ssr: false,
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(clientesQuery), context.queryClient.ensureQueryData(ordensQuery)]),
  component: Dashboard,
});

function Dashboard() {
  const { data: clientes } = useSuspenseQuery(clientesQuery);
  const { data: ordens } = useSuspenseQuery(ordensQuery);
  const finalizadas = ordens.filter((o) => o.status === "finalizada").length;
  const stats = [
    { label: "Clientes", value: clientes.length, icon: Users, tone: "bg-accent text-accent-foreground" },
    { label: "Ordens abertas", value: ordens.length - finalizadas, icon: ClipboardList, tone: "bg-warning/20 text-warning-foreground" },
    { label: "Ordens finalizadas", value: finalizadas, icon: CheckCircle2, tone: "bg-success/15 text-success" },
  ];
  const nome = (id: string) => clientes.find((c) => c.id === id)?.nome ?? "—";

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumo da sua assistência técnica" />
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-0">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex size-12 items-center justify-center rounded-xl ${s.tone}`}><s.icon className="size-6" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6 shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Ordens recentes</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link to="/ordens">Ver todas <ArrowRight /></Link></Button>
        </CardHeader>
        <CardContent className="divide-y">
          {ordens.slice(0, 5).map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium">#{o.numero} · {o.equipamento} {o.marcaModelo}</p>
                <p className="text-sm text-muted-foreground">{nome(o.clienteId)}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
