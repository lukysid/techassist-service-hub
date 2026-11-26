import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCriarCliente } from "@/services/queries";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe o nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20),
  documento: z.string().trim().max(20),
  endereco: z.string().trim().max(200),
});
type Campo = keyof z.infer<typeof schema>;

export function ClienteForm({ onDone }: { onDone: () => void }) {
  const criar = useCriarCliente();
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    await criar.mutateAsync(r.data);
    toast.success("Cliente cadastrado");
    onDone();
  }
  const field = (name: Campo, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} />
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {field("nome", "Nome completo")}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("email", "E-mail", "email")}
        {field("telefone", "Telefone", "tel", "(11) 99999-9999")}
      </div>
      {field("documento", "CPF / CNPJ")}
      {field("endereco", "Endereço")}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone}>Cancelar</Button>
        <Button type="submit" disabled={criar.isPending}>Salvar cliente</Button>
      </div>
    </form>
  );
}
