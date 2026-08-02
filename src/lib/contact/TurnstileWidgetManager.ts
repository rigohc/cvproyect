import { TURNSTILE_SCRIPT_URL } from "./contactFormConfig";

type TurnstileApi = NonNullable<Window["turnstile"]>;

export class TurnstileWidgetManager {
  private widgetId: string | null = null;

  mount(
    container: HTMLElement,
    siteKey: string,
    onToken: (token: string) => void,
    onClear: () => void,
  ): () => void {
    const render = () => {
      if (!window.turnstile || this.widgetId) return;

      this.widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
        callback: onToken,
        "expired-callback": onClear,
        "error-callback": onClear,
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
    }

    return () => {
      if (this.widgetId && window.turnstile) {
        window.turnstile.remove(this.widgetId);
        this.widgetId = null;
      }
    };
  }

  reset(onClear: () => void): void {
    const api = window.turnstile as TurnstileApi | undefined;
    if (this.widgetId && api) {
      api.reset(this.widgetId);
      onClear();
    }
  }
}
