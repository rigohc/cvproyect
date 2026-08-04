export interface Contact {
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  location: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  current?: boolean;
  summary?: string;
  highlights: string[];
  tech?: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface Certification {
  name: string;
  provider: string;
  date: string;
}

export interface Recommendation {
  name: string;
  role: string;
  company: string;
  text: string;
  linkedin?: string;
}

export const profile = {
  name: "Rigoberto Hernández Cruz",
  title: "Desarrollador de Software",
  tagline: "6+ años construyendo e-commerce, automatizaciones y plataformas escalables",
  summary: `Desarrollador con más de 6 años de experiencia diseñando e implementando soluciones tecnológicas en entornos de comercio electrónico, plataformas internas, microservicios y sistemas escalables. Especializado en React.js, Next.js, Angular, Node.js, Python, Java, C#, Magento 2 (Adobe Commerce), VTEX, OpenCart, Laravel, CodeIgniter, TypeScript y Docker, con sólida experiencia en arquitecturas modernas, DevOps y metodologías ágiles.`,
};

export const contact: Contact = {
  phone: "+52 771 232 3051",
  whatsapp: "527712323051",
  whatsappMessage: "Hola Rigoberto, vi tu portafolio y me gustaría contactarte.",
  email: "rigo.hernandez.cruz@hotmail.com",
  location: "Huejutla de Reyes, Hidalgo, México",
  linkedin: "https://www.linkedin.com/in/rigoberto-hernandez-ba63bb159",
};

export const experience: Experience[] = [
  {
    id: "andromeda-digital",
    role: "Desarrollador Full Stack",
    company: "Andromeda Digital",
    period: "Ago 2025 — Presente",
    current: true,
    summary:
      "Desarrollo de automatizaciones, módulos de negocio y flujos de carga masiva con arquitectura orientada a eventos y enfoque en experiencia de usuario.",
    highlights: [
      "Diseño e implementación de automatizaciones de procesos operativos",
      "Carga masiva de productos con eventos asíncronos integrados vía RabbitMQ",
      "Desarrollo del módulo de facturación y módulos de suscripciones en Laravel y Node.js",
      "Interfaces y plantillas guiadas por UX con React.js y Next.js",
      "APIs REST y arquitectura orientada a eventos para integración entre servicios",
    ],
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Laravel",
      "Python",
      "RabbitMQ",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    id: "heb-sismex",
    role: "Desarrollador E-commerce (Multi proyectos) · Líder Técnico",
    company: "HEB — colaborador externo SISMEX",
    period: "Dic 2022 — Jul 2025",
    summary:
      "Liderazgo técnico y desarrollo full stack en proyectos de e-commerce de alto tráfico, integrando marketplaces y plataformas internas.",
    highlights: [
      "Diseño e implementación de interfaces complejas con React.js, Next.js, Ant Design y SCSS",
      "APIs RESTful modulares en Node.js/Express con integraciones VTEX, Rappi y Uber Eats",
      "Sistema de gestión de clientes con microservicios, RabbitMQ, JWT/OAuth y PostgreSQL",
      "Desarrollo e integración de tiendas VTEX IO (React, TypeScript, GraphQL)",
      "Módulos personalizados Magento 2 (Adobe Commerce): frontend PHTML/XML y backend PHP 8.x",
      "Aplicación Angular con APIs REST, Swagger, RBAC y despliegue Dockerizado",
    ],
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "Angular",
      "VTEX",
      "Magento 2",
      "Docker",
      "PostgreSQL",
      "RabbitMQ",
    ],
  },
  {
    id: "heb-morwi",
    role: "Desarrollador Full Stack E-commerce",
    company: "HEB — colaborador externo MORWI",
    period: "Ene 2019 — Nov 2022",
    highlights: [
      "Módulos custom en Magento 2.3.5: controladores, modelos, observers, plugins y crons",
      "Extensiones vía di.xml y consumo/creación de APIs REST y SOAP",
      "Trabajo en metodología ágil, code review y soporte en CI/CD",
    ],
    tech: ["Magento 2", "PHP", "MySQL", "Git", "CI/CD"],
  },
  {
    id: "heb-playful",
    role: "Desarrollador Full Stack E-commerce",
    company: "HEB — colaborador externo Playful",
    period: "Ene 2018 — Jul 2019",
    highlights: [
      "Análisis de requerimientos y documentación de especificaciones funcionales",
      "Desarrollo con Magento 1 y CodeIgniter en entorno ágil",
      "Control de versiones con Git y diseño del aplicativo",
    ],
    tech: ["Magento 1", "CodeIgniter", "PHP", "Git"],
  },
];

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      "HTML5, CSS3, Bootstrap",
      "JavaScript, TypeScript",
      "React.js, Next.js, Angular, Vue.js",
      "Ant Design, SCSS, CSS Modules",
      "PHTML, XML, Responsive Design",
    ],
  },
  {
    title: "Backend",
    items: [
      "Java, C#, Python, PHP 8.x",
      "Node.js / Express.js",
      "Microservicios (RabbitMQ)",
      "JWT, OAuth, RBAC",
      "Laravel, CodeIgniter",
      "MySQL, PostgreSQL, SQL Server",
    ],
  },
  {
    title: "E-commerce & Plataformas",
    items: [
      "Magento 2 (Adobe Commerce)",
      "VTEX IO",
      "OpenCart",
      "Integraciones REST / GraphQL / SOAP",
    ],
  },
  {
    title: "DevOps & Cloud",
    items: [
      "Docker, Docker Compose, Nginx",
      "Git, CI/CD, Linux, Bash",
      "AWS, Azure",
      "Variables de entorno y automatización",
    ],
  },
  {
    title: "Metodologías",
    items: [
      "Scrum, Kanban",
      "Code Review",
      "Documentación técnica (Swagger)",
      "Seguridad en aplicaciones",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "Ingeniería en Tecnologías de la Información",
    institution: "Universidad Tecnológica de la Huasteca Hidalguense",
    period: "2014 — 2018",
  },
];

export const certifications: Certification[] = [
  {
    name: "Java Advanced 2",
    provider: "CodeBasher",
    date: "Ene 2024",
  },
];

export const recommendations: Recommendation[] = [
  {
    name: "Líder de proyecto · SISMEX",
    role: "Coordinación técnica en proyectos HEB",
    company: "HEB / SISMEX",
    text: "Rigoberto demostró liderazgo técnico sólido en proyectos e-commerce de alto impacto, coordinando equipos y entregando soluciones con React, Node.js y VTEX de forma consistente.",
    linkedin: "https://www.linkedin.com/in/rigoberto-hernandez-ba63bb159",
  },
  {
    name: "Equipo de desarrollo · Andromeda Digital",
    role: "Automatización y arquitectura de eventos",
    company: "Andromeda Digital",
    text: "Destaca por diseñar automatizaciones confiables, integrar RabbitMQ en flujos de carga masiva y construir módulos de facturación y suscripciones con enfoque claro en UX.",
    linkedin: "https://www.linkedin.com/in/rigoberto-hernandez-ba63bb159",
  },
];

export const navSections = [
  { id: "empresas", label: "Empresas" },
  { id: "stack", label: "Stack" },
  { id: "experiencia", label: "Experiencia" },
  { id: "formacion", label: "Formación" },
  { id: "recomendaciones", label: "Referencias" },
  { id: "contacto", label: "Contacto" },
] as const;

export interface CompanyItem {
  id: string;
  name: string;
  partner?: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  initials: string;
  accent: string;
  logo?: string;
  current?: boolean;
}

export interface TechItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  category: string;
}

export const heroStats = [
  { value: "6+", label: "años exp." },
  { value: "4", label: "empresas" },
  { value: "20+", label: "tecnologías" },
  { value: "2026", label: "actualizado" },
];

export const companies: CompanyItem[] = [
  {
    id: "andromeda",
    name: "Andromeda Digital",
    role: "Desarrollador Full Stack",
    period: "Ago 2025 — Presente",
    description:
      "Automatizaciones, facturación, suscripciones y carga masiva de productos con RabbitMQ y plantillas UX.",
    tags: ["React", "Laravel", "RabbitMQ"],
    initials: "AD",
    accent: "#ff6b4a",
    current: true,
  },
  {
    id: "heb-sismex",
    name: "HEB",
    partner: "Colaborador externo · SISMEX",
    role: "Líder Técnico E-commerce",
    period: "Dic 2022 — Jul 2025",
    description:
      "Liderazgo técnico en React, Next.js, Node.js, VTEX, Magento 2 y microservicios para retail.",
    tags: ["React", "VTEX", "Node.js"],
    initials: "HEB",
    accent: "#4ecdc4",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/HEB_logo.svg",
  },
  {
    id: "heb-morwi",
    name: "HEB",
    partner: "Colaborador externo · MORWI",
    role: "Desarrollador Magento 2",
    period: "Ene 2019 — Nov 2022",
    description:
      "Módulos custom, APIs REST/SOAP, CI/CD y extensiones avanzadas en Magento 2.3.5.",
    tags: ["Magento 2", "PHP", "CI/CD"],
    initials: "HEB",
    accent: "#5ce1e6",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/HEB_logo.svg",
  },
  {
    id: "heb-playful",
    name: "HEB",
    partner: "Colaborador externo · Playful",
    role: "Desarrollador E-commerce",
    period: "Ene 2018 — Jul 2019",
    description:
      "Desarrollo con Magento 1 y CodeIgniter, análisis de requerimientos y metodología ágil.",
    tags: ["Magento 1", "CodeIgniter", "Git"],
    initials: "HEB",
    accent: "#ff9f43",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/HEB_logo.svg",
  },
];

export const technologies: TechItem[] = [
  { id: "react", name: "React", slug: "react", color: "#61DAFB", category: "frontend" },
  { id: "nextjs", name: "Next.js", slug: "nextdotjs", color: "#ffffff", category: "frontend" },
  { id: "angular", name: "Angular", slug: "angular", color: "#DD0031", category: "frontend" },
  { id: "typescript", name: "TypeScript", slug: "typescript", color: "#3178C6", category: "frontend" },
  { id: "nodejs", name: "Node.js", slug: "nodedotjs", color: "#339933", category: "backend" },
  { id: "laravel", name: "Laravel", slug: "laravel", color: "#FF2D20", category: "backend" },
  { id: "python", name: "Python", slug: "python", color: "#3776AB", category: "backend" },
  { id: "php", name: "PHP", slug: "php", color: "#777BB4", category: "backend" },
  { id: "java", name: "Java", slug: "openjdk", color: "#ffffff", category: "backend" },
  { id: "dotnet", name: "C#", slug: "dotnet", color: "#512BD4", category: "backend" },
  { id: "rabbitmq", name: "RabbitMQ", slug: "rabbitmq", color: "#FF6600", category: "infra" },
  { id: "docker", name: "Docker", slug: "docker", color: "#2496ED", category: "infra" },
  { id: "postgresql", name: "PostgreSQL", slug: "postgresql", color: "#4169E1", category: "data" },
  { id: "mysql", name: "MySQL", slug: "mysql", color: "#4479A1", category: "data" },
  { id: "phpstorm", name: "Magento", slug: "phpstorm", color: "#EE672F", category: "ecommerce" },
  { id: "vtex", name: "VTEX", slug: "vtex", color: "#FF0080", category: "ecommerce" },
  { id: "graphql", name: "GraphQL", slug: "graphql", color: "#E10098", category: "api" },
  { id: "git", name: "Git", slug: "git", color: "#F05032", category: "devops" },
  { id: "nginx", name: "Nginx", slug: "nginx", color: "#009639", category: "devops" },
  { id: "infracost", name: "AWS", slug: "infracost", color: "#FF9900", category: "cloud" },
];
