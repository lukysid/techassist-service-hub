import { cn } from "@/lib/utils";
import { STATUS_LABEL, type StatusOrdem } from "@/services/types";
const styles: Record<StatusOrdem, string> = {
  aberta: "bg-accent text-accent-foreground",
  em_andamento: "bg-primary/10 text-primary",
  aguardando_peca: "bg-warning/20 text-warning-foreground",
  finalizada: "bg-success/15 text-success",
};
export function StatusBadge({ status }: { status: StatusOrdem }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[status])}>{STATUS_LABEL[status]}</span>;
}
