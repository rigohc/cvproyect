export const CONTACT_FORM_LIMITS = {
  minSubmitMs: 4000,
  maxName: 80,
  maxEmail: 120,
  maxMessage: 2000,
  minMessage: 20,
} as const;

export const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Web3Forms exige envío desde el navegador en plan gratuito (la clave puede ser pública). */
export const web3FormsAccessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
