import type { APIRoute } from "astro";
import OpenAI from "openai";
import { contact, experience, profile, skills } from "../../data/cv";
import { assistantKnowledge, featuredProjects } from "../../data/portfolio";

export const prerender = false;

const maxMessageLength = 1_500;

const portfolioContext = JSON.stringify({
  profile,
  experience,
  skills,
  featuredProjects,
  contact: {
    email: contact.email,
    location: contact.location,
    linkedin: contact.linkedin,
    whatsappPreferred: true,
  },
});

const systemPrompt = `Eres el asistente profesional de ${profile.name}.
Responde siempre en español, con claridad y en un máximo de 120 palabras.
Usa exclusivamente la información del portafolio incluida abajo. No inventes experiencias, fechas, empresas, métricas ni datos de contacto. Si la respuesta no está en el contexto, indícalo y ofrece orientar sobre la experiencia, el stack, los proyectos o el contacto.

CONTEXTO DEL PORTAFOLIO:
${portfolioContext}`;

function findLocalAnswer(input: string): string {
  const normalized = input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  for (const entry of assistantKnowledge) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.answer;
    }
  }
  return "Puedo contarte sobre mi experiencia en Andromeda, HEB/SISMEX, Magento, VTEX, mi stack o cómo contactarme. ¿Qué te interesa?";
}

export const POST: APIRoute = async ({ request }) => {
  let message: unknown;

  try {
    ({ message } = await request.json());
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "Escribe una pregunta." }, { status: 400 });
  }

  const trimmed = message.trim().slice(0, maxMessageLength);

  if (!import.meta.env.OPENAI_API_KEY) {
    return Response.json({ text: findLocalAnswer(trimmed), source: "local" });
  }

  const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: trimmed },
      ],
      max_tokens: 220,
      temperature: 0.4,
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("empty response");

    return Response.json({ text, source: "ai" });
  } catch (error) {
    const status = error instanceof OpenAI.APIError ? error.status : undefined;
    console.error("Portfolio assistant error:", status ?? "unknown");

    const fallback = findLocalAnswer(trimmed);
    if (status === 429) {
      return Response.json({ text: fallback, source: "local", notice: "Cuota IA agotada, respuesta local." });
    }

    return Response.json({ text: fallback, source: "local" });
  }
};
