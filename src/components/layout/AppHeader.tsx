import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <span className="text-lg font-bold tracking-tight text-primary">TechAssist</span>
      <span className="hidden text-sm text-muted-foreground sm:inline">· Gestão de assistência técnica</span>
      <div className="ml-auto flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">TA</div>
    </header>
  );
}
