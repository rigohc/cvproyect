# Guía del proyecto y plan de estudio

## 1. Qué es este proyecto

Es un portafolio profesional de **Rigoberto Hernández Cruz**. Está construido como una aplicación web rápida con Astro y componentes interactivos en React. Su propósito es presentar experiencia, proyectos, tecnologías y canales de contacto; además incluye un asistente de IA que responde preguntas sobre el CV.

El sitio se publica en Vercel. La página visual es estática y rápida, mientras que los formularios y el asistente usan rutas de servidor para proteger las claves privadas.

## 2. Tecnologías usadas

| Tecnología | Para qué se usa aquí |
| --- | --- |
| Astro 7 | Estructura del sitio, rutas y compilación. |
| React 19 | Componentes con estado e interacción: galería, formulario, navegación y asistente. |
| TypeScript | Tipos para datos del CV, props y respuestas de API. |
| Motion | Animaciones de entrada, transiciones y mapa de tecnologías. |
| CSS global + Tailwind Vite | Diseño visual, tema oscuro/claro y estilos responsivos. |
| OpenAI SDK + Responses API | Asistente de preguntas sobre el portafolio. |
| Vercel adapter | Despliegue y ejecución de rutas API bajo demanda. |
| Cloudflare Turnstile | Protección anti-bots opcional del formulario. |
| Web3Forms | Entrega de mensajes enviados desde el formulario. |
| GitHub REST API | Estadísticas públicas de `rigohc` mostradas en vivo. |

## 3. Mapa del código

```text
src/
├── pages/
│   ├── index.astro                Página principal
│   └── api/
│       ├── assistant.ts            Endpoint seguro del asistente IA
│       └── contact.ts              Endpoint del formulario de contacto
├── components/
│   ├── portfolio/                  Secciones principales del portafolio
│   ├── react/                      Componentes visuales reutilizables
│   ├── amicro/                     Microinteracciones y animaciones
│   └── icons/                      Iconos propios
├── data/
│   ├── cv.ts                       Datos de perfil, experiencia y stack
│   └── portfolio.ts                Proyectos, galería y contenido del sitio
├── layouts/Layout.astro            HTML base, SEO y selector de tema
└── styles/global.css               Variables, estilos y diseño global
```

## 4. Cómo funciona cada parte

### Página y datos

`src/pages/index.astro` compone el layout y carga `PortfolioApp` como una isla React con `client:load`. Los datos no están duplicados en los componentes: provienen de `src/data/cv.ts` y `src/data/portfolio.ts`.

**Ejercicio:** cambia el resumen, agrega una tecnología o un proyecto en los archivos de datos y confirma que aparezca en la página sin modificar el componente visual.

### Componentes e interactividad

`PortfolioApp.tsx` contiene las secciones, detecta la sección visible con `IntersectionObserver` y conserva el proyecto seleccionado con `useState`. La galería abre un lightbox; el mapa de tecnologías calcula posiciones circulares para sus nodos; Motion anima los cambios.

**Ejercicio:** añade un cuarto proyecto a `featuredProjects`, con cinco pasos de arquitectura, y comprueba que aparezca como pestaña.

### Formulario de contacto

`ContactForm.tsx` valida los datos en el navegador. `src/pages/api/contact.ts` vuelve a validarlos en el servidor, incluye un honeypot y una espera mínima contra spam, verifica Turnstile cuando está configurado y entrega el mensaje por Web3Forms.

Variables relacionadas:

```env
WEB3FORMS_ACCESS_KEY=
TURNSTILE_SECRET_KEY=
PUBLIC_TURNSTILE_SITE_KEY=
```

**Ejercicio:** lee primero las validaciones del cliente y después las del endpoint. Identifica por qué se necesitan ambas.

### Asistente con IA

`PortfolioAssistant.tsx` envía la pregunta a `POST /api/assistant`. El endpoint `src/pages/api/assistant.ts` construye el contexto usando los datos del CV, llama a la Responses API y devuelve solo el texto final. La clave nunca se manda al navegador.

```text
Navegador → /api/assistant → OpenAI Responses API → respuesta al navegador
```

Variable necesaria:

```env
OPENAI_API_KEY=
```

La cuenta de OpenAI debe tener cuota disponible. Si responde `429`, revisa facturación, crédito y límites del proyecto en la plataforma de OpenAI.

**Ejercicio:** cambia las instrucciones del asistente para que devuelva las respuestas en formato de viñetas, sin permitir que invente información.

## 5. Orden recomendado para estudiarlo

No intentes comprender todo a la vez. Sigue este orden y modifica el código al terminar cada bloque.

1. **Astro y estructura del proyecto (días 1–2).** Lee `index.astro`, `Layout.astro` y `astro.config.mjs`. Aprende qué es una ruta basada en archivos y qué significa `client:load`.
2. **TypeScript y datos (días 3–4).** Revisa las interfaces y arreglos de `cv.ts` y `portfolio.ts`. Agrega contenido real usando los tipos existentes.
3. **React (días 5–7).** Estudia `PortfolioApp.tsx`, `ProfileGallery.tsx` y `PortfolioAssistant.tsx`. Enfócate en props, `useState`, `useEffect`, eventos y renderizado condicional.
4. **Estilos y animaciones (días 8–9).** Inspecciona `global.css` y después los `style` de cada componente. Luego revisa las animaciones de Motion.
5. **Backend con Astro (días 10–11).** Lee los endpoints `contact.ts` y `assistant.ts`. Practica solicitudes `fetch`, JSON, códigos HTTP y variables de entorno.
6. **Integración de IA y despliegue (días 12–14).** Estudia el contexto, las instrucciones y la respuesta de OpenAI. Finalmente despliega en Vercel y configura las variables allí.

## 6. Comandos de trabajo

```bash
npm install       # instala dependencias
npm run dev       # ejecuta desarrollo local
npm run build     # genera y valida el build de producción
```

No subas `.env` al repositorio. Usa `.env.example` como plantilla y configura las mismas variables de entorno en Vercel.

## 7. Videos y recursos para aprender

### Ruta esencial

- [Curso oficial de Astro y recursos seleccionados](https://docs.astro.build/en/astro-courses/) — comienza aquí para entender páginas `.astro`, islas y despliegue.
- [React + TypeScript para principiantes (freeCodeCamp)](https://www.classcentral.com/course/freecodecamp-react-typescript-course-for-beginners-104875) — props, hooks y tipos aplicados a un proyecto.
- [Curso completo de Node.js y Express (freeCodeCamp)](https://www.youtube.com/watch?v=Oe421EPjeBE) — útil para comprender endpoints, `Request`, `Response` y APIs.
- [Curso de TypeScript en YouTube (búsqueda en freeCodeCamp)](https://www.youtube.com/results?search_query=freeCodeCamp+TypeScript+full+course) — estudia tipos, interfaces, uniones y genéricos antes de profundizar en React.
- [OpenAI Academy: Responses API, herramientas y funciones](https://academy.openai.com/public/clubs/builders-etkn1/videos/ai-techniques-tools-and-features-in-the-responses-api) — directamente relacionado con `api/assistant.ts`.

### Para las partes visuales y de despliegue

- [Motion para React — videos y ejemplos](https://www.youtube.com/results?search_query=Motion+for+React+Framer+Motion+tutorial) — úsalo mientras lees las animaciones en `PortfolioApp.tsx` y `TechConstellation.tsx`.
- [Tailwind CSS — canal oficial](https://www.youtube.com/@TailwindLabs) — aunque el proyecto usa sobre todo CSS propio, te ayudará a entender la integración de Tailwind con Vite.
- [Cloudflare Turnstile — videos oficiales](https://www.youtube.com/results?search_query=Cloudflare+Turnstile+official+tutorial) — para profundizar en la protección del formulario.
- [Guía oficial del adaptador Vercel para Astro](https://docs.astro.build/en/guides/integrations-guide/vercel/) — explica por qué las rutas API necesitan el adaptador y cómo desplegarlas.

## 8. Retos para dominar el proyecto

1. Añade un filtro por categoría a las tecnologías.
2. Haz que el asistente conserve las últimas tres preguntas en una conversación, sin mandar datos privados.
3. Agrega mensajes de éxito o fallo más detallados al formulario.
4. Extrae los estilos internos de un componente a una hoja CSS sin cambiar el diseño.
5. Crea una página `/proyectos` en Astro que reutilice los datos de `featuredProjects`.
6. Escribe tres pruebas manuales: formulario inválido, asistente sin cuota y respuesta exitosa del asistente.

La mejor forma de estudiarlo es seguir el ciclo: **leer un componente → modificar algo pequeño → ejecutar el sitio → explicar con tus propias palabras qué cambió**.
