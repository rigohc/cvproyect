import { parseJsonResponse } from "./parseJsonResponse";

export interface Web3FormsPayload {
  name: string;
  email: string;
  message: string;
}

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

export async function submitToWeb3Forms(
  accessKey: string,
  payload: Web3FormsPayload,
): Promise<void> {
  if (!accessKey) {
    throw new Error("Formulario no configurado. Usa WhatsApp o correo directo.");
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: payload.name,
      email: payload.email,
      message: payload.message,
      replyto: payload.email,
      botcheck: "",
      subject: "Nuevo mensaje — Portafolio Rigoberto",
      from_name: "Portafolio RC",
    }),
  });

  const data = await parseJsonResponse<Web3FormsResponse>(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "No se pudo enviar el mensaje.");
  }
}
