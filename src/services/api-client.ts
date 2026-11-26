/**
 * Cliente HTTP da API REST educacional Technoworks.
 *
 * Configure VITE_TECHNOWORKS_RA no .env.local. Sem RA configurado,
 * o projeto continua usando o armazenamento local para desenvolvimento.
 */
const API_URL = (
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "https://technoworks.com.br"
).replace(/\/$/, "");

const RA = (import.meta.env["VITE_TECHNOWORKS_RA"] as string | undefined)?.trim() ?? "";

export const useMock = RA.length === 0;
export const REST_URL = RA ? `${API_URL}/rest/${encodeURIComponent(RA)}` : "";

export interface ApiEnvelope<T> {
  status: string;
  ra?: string;
  total?: number;
  dados: T;
  mensagem?: string;
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const responseText = response.status === 204 ? "" : await response.text();
  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = responseText;
    }
  }

  if (!response.ok) {
    const apiMessage =
      typeof payload === "object" && payload !== null && "mensagem" in payload
        ? String(payload.mensagem)
        : typeof payload === "string"
          ? payload
          : response.statusText;
    throw new Error(`Technoworks (${response.status}): ${apiMessage}`);
  }

  return payload as T;
}

export async function listarRegistros<T extends { tipo?: string }>(tipo: string): Promise<T[]> {
  if (useMock) throw new Error("A API Technoworks não está configurada.");
  const response = await http<ApiEnvelope<T[]>>(`${REST_URL}?limite=100`);
  if (!Array.isArray(response?.dados)) {
    throw new Error("A resposta da Technoworks não contém a lista esperada em 'dados'.");
  }
  return response.dados.filter((item) => item.tipo === tipo);
}

export async function criarRegistro<T>(registro: Record<string, unknown>): Promise<T> {
  const response = await http<ApiEnvelope<T>>(REST_URL, {
    method: "POST",
    body: JSON.stringify(registro),
  });
  return response.dados;
}

export async function atualizarRegistro<T>(id: string, campos: Record<string, unknown>): Promise<T> {
  const response = await http<ApiEnvelope<T>>(`${REST_URL}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(campos),
  });
  return response.dados;
}

export async function excluirRegistro(id: string): Promise<void> {
  await http<ApiEnvelope<unknown>>(`${REST_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
