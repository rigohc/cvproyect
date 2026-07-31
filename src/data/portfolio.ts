export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  year: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "desk-code",
    src: "/images/gallery/desk-code.png",
    alt: "Rigoberto resolviendo un cubo Rubik en su escritorio con código en pantalla",
    caption: "Resolver problemas — en código y en la vida",
    year: "2018",
  },
  {
    id: "team-meeting",
    src: "/images/gallery/team-meeting.png",
    alt: "Equipo de desarrollo en reunión con laptops",
    caption: "Trabajo en equipo · metodología ágil",
    year: "2019",
  },
  {
    id: "laptop-stickers",
    src: "/images/gallery/laptop-stickers.png",
    alt: "Rigoberto trabajando con laptop con stickers de Magento y PHP",
    caption: "Magento · PHP · e-commerce",
    year: "2019",
  },
  {
    id: "office-casual",
    src: "/images/gallery/office-casual.png",
    alt: "Rigoberto en entorno de oficina",
    caption: "Día a día en desarrollo",
    year: "2019",
  },
];

export interface PortfolioProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  impact: string;
  tech: string[];
  accent: string;
  architecture: Array<{ step: string; title: string; detail: string }>;
}

export interface JourneyStep {
  step: number;
  phase: string;
  title: string;
  description: string;
  proof: string;
}

export interface HireSignal {
  metric: string;
  label: string;
  title: string;
  description: string;
}

export interface AssistantEntry {
  keywords: string[];
  answer: string;
}

export const portfolioHeadline = {
  roles: ["Full Stack Dev", "E-commerce", "Automatización"],
  hook: "¿Y si tu portafolio explicara tu trabajo antes de la entrevista?",
  mission:
    "No es una lista de tecnologías — es cómo pienso como ingeniero: sistemas de retail, eventos asíncronos, integraciones y productos que la gente puede entender, confiar y usar.",
};

export const featuredProjects: PortfolioProject[] = [
  {
    id: "andromeda-automation",
    name: "Plataforma Andromeda",
    tagline: "Automatización · Facturación · Suscripciones",
    description:
      "Sistema de automatización operativa con carga masiva de productos, módulos de facturación y suscripciones guiados por UX.",
    impact: "Arquitectura orientada a eventos con RabbitMQ para procesos de alto volumen.",
    tech: ["React", "Next.js", "Laravel", "RabbitMQ", "PostgreSQL"],
    accent: "#ff6b4a",
    architecture: [
      { step: "01", title: "Entrada UX", detail: "Plantillas guiadas y flujos operativos" },
      { step: "02", title: "Orquestación", detail: "APIs Node.js + Laravel modular" },
      { step: "03", title: "Event Bus", detail: "RabbitMQ · carga masiva async" },
      { step: "04", title: "Módulos", detail: "Facturación · suscripciones" },
      { step: "05", title: "Entrega", detail: "Docker · monitoreo · despliegue" },
    ],
  },
  {
    id: "heb-microservices",
    name: "HEB · Gestión de Clientes",
    tagline: "Microservicios · VTEX · Marketplaces",
    description:
      "Plataforma interna con microservicios, autenticación OAuth y integraciones VTEX, Rappi y Uber Eats.",
    impact: "Liderazgo técnico en e-commerce de alto tráfico para retail.",
    tech: ["React", "Node.js", "RabbitMQ", "PostgreSQL", "VTEX"],
    accent: "#4ecdc4",
    architecture: [
      { step: "01", title: "Frontend", detail: "React · Next.js · Ant Design" },
      { step: "02", title: "API Gateway", detail: "REST · JWT · OAuth" },
      { step: "03", title: "Servicios", detail: "Microservicios desacoplados" },
      { step: "04", title: "Mensajería", detail: "RabbitMQ entre dominios" },
      { step: "05", title: "Integraciones", detail: "VTEX · Rappi · Uber Eats" },
    ],
  },
  {
    id: "magento-ecosystem",
    name: "Ecosistema Magento 2",
    tagline: "Adobe Commerce · Módulos Custom",
    description:
      "Módulos personalizados, extensiones di.xml, APIs REST/SOAP y despliegue Dockerizado para HEB.",
    impact: "4+ años extendiendo Magento en entornos ágiles con CI/CD.",
    tech: ["Magento 2", "PHP", "Docker", "MySQL", "GraphQL"],
    accent: "#ff6b4a",
    architecture: [
      { step: "01", title: "Storefront", detail: "PHTML · XML · JS custom" },
      { step: "02", title: "Backend", detail: "Módulos · plugins · observers" },
      { step: "03", title: "Datos", detail: "MySQL · caches · indexers" },
      { step: "04", title: "APIs", detail: "REST · SOAP · integraciones" },
      { step: "05", title: "DevOps", detail: "Docker · Nginx · CI/CD" },
    ],
  },
];

export const journeySteps: JourneyStep[] = [
  {
    step: 1,
    phase: "Formación",
    title: "Ingeniería en TI",
    description: "Universidad Tecnológica de la Huasteca Hidalguense — bases sólidas en desarrollo de software.",
    proof: "2014 — 2018 · Título de Ingeniería",
  },
  {
    step: 2,
    phase: "Primeros sistemas",
    title: "E-commerce con Magento 1",
    description: "Análisis de requerimientos, CodeIgniter y metodología ágil en proyectos HEB vía Playful.",
    proof: "HEB · Playful · 2018 — 2019",
  },
  {
    step: 3,
    phase: "Especialización",
    title: "Magento 2 a profundidad",
    description: "Módulos custom, APIs, CI/CD y extensiones avanzadas en entorno enterprise.",
    proof: "HEB · MORWI · 2019 — 2022",
  },
  {
    step: 4,
    phase: "Liderazgo técnico",
    title: "Multi-proyecto retail",
    description: "React, Node.js, VTEX, microservicios y liderazgo en integraciones de marketplaces.",
    proof: "HEB · SISMEX · 2022 — 2025",
  },
  {
    step: 5,
    phase: "Automatización",
    title: "Andromeda Digital",
    description: "Automatizaciones, facturación, suscripciones y eventos con RabbitMQ.",
    proof: "Actual · Ago 2025 — Presente",
  },
  {
    step: 6,
    phase: "Próximo capítulo",
    title: "Ingeniero de producto",
    description: "Busco problemas desafiantes en full stack, e-commerce y arquitectura de sistemas escalables.",
    proof: "Abierto a oportunidades · 2026",
  },
];

export const hireSignals: HireSignal[] = [
  {
    metric: "6+",
    label: "años de experiencia",
    title: "E-commerce real",
    description: "Magento, VTEX, integraciones y retail de alto tráfico — no solo tutoriales.",
  },
  {
    metric: "4",
    label: "empresas",
    title: "Ownership end-to-end",
    description: "De requerimiento a despliegue: frontend, backend, eventos y DevOps.",
  },
  {
    metric: "20+",
    label: "tecnologías",
    title: "Stack verificable",
    description: "React, Node, Laravel, RabbitMQ, Docker — cada nodo mapea a un proyecto real.",
  },
  {
    metric: "3",
    label: "dominios",
    title: "Pensamiento de sistemas",
    description: "Microservicios, colas de mensajes y arquitectura orientada a eventos en producción.",
  },
];

export const assistantKnowledge: AssistantEntry[] = [
  {
    keywords: ["quien", "eres", "presentacion", "rigoberto"],
    answer:
      "Soy Rigoberto Hernández Cruz, desarrollador full stack con 6+ años en e-commerce, automatizaciones y microservicios. Actualmente en Andromeda Digital; antes lideré proyectos HEB vía SISMEX.",
  },
  {
    keywords: ["andromeda", "actual", "trabajo", "ahora"],
    answer:
      "En Andromeda Digital construyo automatizaciones, módulos de facturación y suscripciones, carga masiva de productos con RabbitMQ y plantillas UX con React/Next.js.",
  },
  {
    keywords: ["heb", "sismex", "retail", "vtex"],
    answer:
      "En HEB/SISMEX fui líder técnico en React, Next.js, Node.js, VTEX IO, Magento 2 y microservicios con integraciones a Rappi y Uber Eats.",
  },
  {
    keywords: ["magento", "adobe", "commerce"],
    answer:
      "Tengo experiencia profunda en Magento 2: módulos custom, di.xml, observers, plugins, APIs REST/SOAP y despliegue Docker.",
  },
  {
    keywords: ["stack", "tecnolog", "herramient"],
    answer:
      "Mi stack principal: React, Next.js, Angular, Node.js, TypeScript, Laravel, Python, PHP, RabbitMQ, PostgreSQL, Docker, VTEX y Magento 2.",
  },
  {
    keywords: ["contacto", "email", "contratar", "linkedin", "whatsapp"],
    answer:
      "Puedes escribirme por WhatsApp (canal preferido), en rigo.hernandez.cruz@hotmail.com o en LinkedIn: linkedin.com/in/rigoberto-hernandez-ba63bb159. No comparto número para llamadas por seguridad.",
  },
  {
    keywords: ["proyecto", "portfolio", "que has hecho"],
    answer:
      "Mis proyectos destacados: plataforma de automatización Andromeda, microservicios HEB/VTEX, ecosistema Magento 2 enterprise, y tiendas VTEX IO con GraphQL.",
  },
];

export const marqueeItems = [
  "Full Stack",
  "E-commerce",
  "React",
  "Node.js",
  "RabbitMQ",
  "Magento 2",
  "VTEX",
  "Microservicios",
  "Automatización",
  "Docker",
  "Abierto a work",
];

export const commandSections = [
  { id: "command", label: "Inicio" },
  { id: "about", label: "Perfil" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Proyectos" },
  { id: "github", label: "GitHub" },
  { id: "journey", label: "Trayectoria" },
  { id: "hire", label: "Por qué yo" },
  { id: "contact", label: "Contacto" },
] as const;

/** GitHub: https://github.com/rigohc */
export const githubUsername = import.meta.env.PUBLIC_GITHUB_USERNAME ?? "rigohc";
