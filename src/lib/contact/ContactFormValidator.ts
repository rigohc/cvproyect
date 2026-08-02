import { CONTACT_FORM_LIMITS } from "./contactFormConfig";

export type ContactFormFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
  turnstile?: string;
  timing?: string;
};

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  honeypot: string;
  loadedAt: number;
  turnstileRequired: boolean;
  turnstileToken: string;
}

export class ContactFormValidator {
  sanitize(value: string): string {
    return value.replace(/[<>\u0000-\u001F]/g, "").trim();
  }

  validate(payload: ContactFormPayload): ContactFormFieldErrors {
    const errors: ContactFormFieldErrors = {};

    if (payload.honeypot) return errors;

    if (Date.now() - payload.loadedAt < CONTACT_FORM_LIMITS.minSubmitMs) {
      errors.timing = "Espera un momento antes de enviar.";
      return errors;
    }

    const name = this.sanitize(payload.name);
    const email = this.sanitize(payload.email);
    const message = this.sanitize(payload.message);

    if (!name || name.length > CONTACT_FORM_LIMITS.maxName) {
      errors.name = "Indica un nombre válido.";
    }

    if (!this.isValidEmail(email)) {
      errors.email = "Indica un correo válido.";
    }

    if (message.length < CONTACT_FORM_LIMITS.minMessage || message.length > CONTACT_FORM_LIMITS.maxMessage) {
      errors.message = `El mensaje debe tener entre ${CONTACT_FORM_LIMITS.minMessage} y ${CONTACT_FORM_LIMITS.maxMessage} caracteres.`;
    }

    if (payload.turnstileRequired && !payload.turnstileToken) {
      errors.turnstile = "Completa la verificación anti-bots.";
    }

    return errors;
  }

  toCleanPayload(payload: ContactFormPayload) {
    return {
      name: this.sanitize(payload.name),
      email: this.sanitize(payload.email),
      message: this.sanitize(payload.message),
    };
  }

  firstError(errors: ContactFormFieldErrors): string | null {
    return (
      errors.timing ??
      errors.name ??
      errors.email ??
      errors.message ??
      errors.turnstile ??
      null
    );
  }

  private isValidEmail(email: string): boolean {
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      email.length <= CONTACT_FORM_LIMITS.maxEmail
    );
  }
}

export const contactFormValidator = new ContactFormValidator();
