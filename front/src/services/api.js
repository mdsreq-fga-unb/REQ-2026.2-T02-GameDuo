// Comunicação com o backend Laravel.
// Em desenvolvimento o Vite repassa /api para o Laravel (ver vite.config.js).
// Para apontar para outro servidor, defina VITE_API_URL (ex.: https://api.gameduo.com).
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const TOKEN_KEY = "gameduo:token";

export function lerToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function salvarToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Navegador bloqueou o armazenamento: o login só dura até o F5.
  }
}

// Erro com o status HTTP e os erros de validação (campo → mensagens) devolvidos pela API.
export class ApiError extends Error {
  constructor(status, message, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Faz a requisição e devolve o JSON da resposta. Em caso de erro, lança ApiError.
export async function api(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = lerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = response.status === 429
      ? "Muitas tentativas. Aguarde um minuto e tente novamente."
      : data.message ?? "Algo deu errado. Tente novamente.";
    throw new ApiError(response.status, message, data.errors);
  }

  return data;
}

// Pega a primeira mensagem de cada campo: { email: ["msg"] } → { email: "msg" }.
export function errosPorCampo(error) {
  return Object.fromEntries(
    Object.entries(error?.errors ?? {}).map(([campo, mensagens]) => [campo, mensagens[0]])
  );
}
