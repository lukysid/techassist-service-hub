/**
 * Cliente HTTP genérico para a futura API REST (JSON).
 * Defina VITE_API_URL para ativar; enquanto vazio, os serviços usam o armazenamento local (mock).
 */
export const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "";
export const useMock = !API_URL;

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Accept: "application/json", ...init.headers },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
  return (res.status === 204 ? undefined : await res.json()) as T;
}
