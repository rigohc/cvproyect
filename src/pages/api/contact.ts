import type { APIRoute } from "astro";

export const prerender = false;

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 2000;
const MIN_SUBMIT_MS = 4000;

function sanitize(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[<>\u0000-\u001F]/g, "").trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL;
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return Boolean(data.success);
}

async function sendViaWeb3Forms(payload: Record<string, string>): Promise<void> {
  const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("Formulario no configurado. Usa WhatsApp o correo directo.");
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      ...payload,
      botcheck: "",
      subject: "Nuevo mensaje — Portafolio Rigoberto",
      from_name: "Portafolio RH",
    }),
  });

  const data = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Error al procesar el mensaje.");
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ ok: false, error: "Solicitud inválida." }), { status: 415 });
    }

    const body = await request.json();
    const honeypot = sanitize(body.website, 200);
    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const loadedAt = Number(body.loadedAt);
    if (!Number.isFinite(loadedAt) || Date.now() - loadedAt < MIN_SUBMIT_MS) {
      return new Response(JSON.stringify({ ok: false, error: "Envío demasiado rápido." }), { status: 429 });
    }

    const name = sanitize(body.name, MAX_NAME);
    const email = sanitize(body.email, MAX_EMAIL);
    const message = sanitize(body.message, MAX_MESSAGE);

    if (!name || !isValidEmail(email) || message.length < 20) {
      return new Response(JSON.stringify({ ok: false, error: "Datos inválidos." }), { status: 400 });
    }

    const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
    const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
    if (turnstileSecret && turnstileSiteKey) {
      const token = sanitize(body.turnstileToken, 2048);
      if (!token) {
        return new Response(JSON.stringify({ ok: false, error: "Verificación anti-bots requerida." }), { status: 400 });
      }
      const valid = await verifyTurnstile(token, clientAddress ?? null);
      if (!valid) {
        return new Response(JSON.stringify({ ok: false, error: "Verificación anti-bots fallida." }), { status: 403 });
      }
    }

    await sendViaWeb3Forms({
      name,
      email,
      message,
      replyto: email,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno.";
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
