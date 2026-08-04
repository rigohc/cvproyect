export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json") && !text.trimStart().startsWith("{")) {
    throw new Error("El servicio de correo respondió de forma inesperada. Intenta de nuevo o usa WhatsApp.");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("El servicio de correo respondió de forma inesperada. Intenta de nuevo o usa WhatsApp.");
  }
}
