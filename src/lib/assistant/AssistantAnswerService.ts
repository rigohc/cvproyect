import { assistantKnowledge, type AssistantEntry } from "../../data/portfolio";

const DEFAULT_ANSWER =
  "Puedo contarte sobre mi experiencia en Andromeda, HEB/SISMEX, Magento, VTEX, mi stack o cómo contactarme. ¿Qué te interesa?";

export class AssistantAnswerService {
  constructor(private readonly knowledge: AssistantEntry[] = assistantKnowledge) {}

  findLocalAnswer(input: string): string {
    const normalized = this.normalize(input);

    for (const entry of this.knowledge) {
      if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
        return entry.answer;
      }
    }

    return DEFAULT_ANSWER;
  }

  private normalize(value: string): string {
    return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }
}

export const assistantAnswerService = new AssistantAnswerService();
