import {  IconFlag, IconMountain, IconTree, IconBeach, IconAnchor } from '@tabler/icons-react';
import { Subject, SubjectsType } from '../UI_PROCESS/UI_JUEGOS/interface/interface';

export const promptTemplate = `Eres un generador de JSON. Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin bloques de código, sin markdown.

Genera exactamente este JSON con 5 materias y 4 preguntas cada una. Sé conciso en los textos para no exceder el límite de tokens.

Reglas estrictas:
- Solo JSON, nada más
- Preguntas cortas (máximo 15 palabras)
- Opciones cortas (máximo 5 palabras cada una)
- Explicaciones cortas (máximo 12 palabras)
- 4 preguntas por materia, ni más ni menos

{
  "historia_ecuador": {
    "name": "Historia del Ecuador",
    "icon": "IconFlag",
    "color": "yellow",
    "questions": [...]
  },
  "historia_andina": {
    "name": "Historia Andina del Ecuador",
    "icon": "IconMountain",
    "color": "green",
    "questions": [...]
  },
  "historia_costera": {
    "name": "Historia Costeña del Ecuador",
    "icon": "IconSunset",
    "color": "blue",
    "questions": [...]
  },
  "historia_amazonica": {
    "name": "Historia Amazónica del Ecuador",
    "icon": "IconTree",
    "color": "teal",
    "questions": [...]
  },
  "historia_insular": {
    "name": "Historia Insular y Galápagos",
    "icon": "IconAnchor",
    "color": "orange",
    "questions": [...]
  }
}

Cada pregunta debe seguir exactamente esta estructura:
{
  "q": "Pregunta corta aquí.",
  "a": ["Opción1", "Opción2", "Opción3", "Opción4"],
  "correct": 0,
  "difficulty": 1,
  "explanation": "Explicación breve."
}

La respuesta correcta siempre va en el índice 0 del array "a", y "correct" siempre es 0.
Varía difficulty entre 1, 2 y 3.`


export const SUBJECTS: SubjectsType = {
  historia_ecuador: {
    name: 'Historia del Ecuador',
    icon: IconFlag,
    color: 'yellow',
    questions: [
      { q: '¿En qué año fue el Primer Grito de Independencia del Ecuador?', a: ['1809', '1810', '1822', '1830'], correct: 0, difficulty: 1, explanation: 'El Primer Grito de Independencia fue el 10 de agosto de 1809.' },
      { q: '¿Quién fue líder de la Revolución Liberal?', a: ['Eloy Alfaro', 'Gabriel García Moreno', 'Juan José Flores', 'Antonio José de Sucre'], correct: 0, difficulty: 2, explanation: 'Eloy Alfaro fue el principal líder de la Revolución Liberal.' },
      { q: '¿En qué año se fundó la República del Ecuador?', a: ['1830', '1822', '1809', '1845'], correct: 0, difficulty: 2, explanation: 'Ecuador se constituyó como República en 1830.' },
      { q: '¿Qué batalla consolidó la independencia del Ecuador?', a: ['Batalla de Pichincha', 'Batalla de Tarqui', 'Batalla de Ayacucho', 'Batalla de Junín'], correct: 0, difficulty: 2, explanation: 'La Batalla de Pichincha en 1822 aseguró la independencia de Quito.' },
      { q: '¿Quién fue Manuela Sáenz?', a: ['Heroína independentista', 'Presidenta del Ecuador', 'Escritora colonial', 'Virreina'], correct: 0, difficulty: 1, explanation: 'Manuela Sáenz fue una heroína de la independencia sudamericana.' }
    ]
  },

  historia_andina: {
    name: 'Historia Andina del Ecuador',
    icon: IconMountain,
    color: 'green',
    questions: [
      { q: '¿Qué cultura prehispánica habitó principalmente la Sierra ecuatoriana?', a: ['Caras o Quitus', 'Valdivia', 'Manteña', 'Huancavilca'], correct: 0, difficulty: 2, explanation: 'Los Quitus habitaron la región andina antes de la llegada inca.' },
      { q: '¿Cuándo fue incorporado el territorio ecuatoriano al Imperio Inca?', a: ['Siglo XV', 'Siglo XII', 'Siglo XVI', 'Siglo XIII'], correct: 0, difficulty: 3, explanation: 'El Tahuantinsuyo incorporó estos territorios en el siglo XV bajo Túpac Yupanqui.' },
      { q: '¿Quién fue Rumiñahui?', a: ['General inca que resistió la conquista española', 'Rey de los Shyris', 'Conquistador español', 'Primer presidente del Ecuador'], correct: 0, difficulty: 2, explanation: 'Rumiñahui fue el guerrero inca que defendió Quito ante la conquista.' },
      { q: '¿Qué ciudad serrana fue declarada Patrimonio de la Humanidad por la UNESCO en 1978?', a: ['Quito', 'Cuenca', 'Riobamba', 'Loja'], correct: 0, difficulty: 1, explanation: 'Quito fue una de las primeras ciudades declaradas Patrimonio de la Humanidad.' },
      { q: '¿Qué cultura construyó los famosos "tolas" o montículos en la Sierra norte?', a: ['Cara', 'Valdivia', 'Chorrera', 'Cañari'], correct: 0, difficulty: 3, explanation: 'La cultura Cara construyó montículos ceremoniales llamados tolas.' }
    ]
  },

  historia_costera: {
    name: 'Historia Costeña del Ecuador',
    icon: IconBeach,
    color: 'blue',
    questions: [
      { q: '¿Qué cultura es considerada la más antigua de América por su cerámica?', a: ['Valdivia', 'Manteña', 'Huancavilca', 'Chorrera'], correct: 0, difficulty: 2, explanation: 'La cultura Valdivia (3500 a.C.) produjo la cerámica más antigua conocida de América.' },
      { q: '¿Qué ciudad costera fue capital de la Audiencia de Quito en asuntos comerciales?', a: ['Guayaquil', 'Manta', 'Esmeraldas', 'Salinas'], correct: 0, difficulty: 2, explanation: 'Guayaquil fue el principal puerto y centro comercial de la Audiencia.' },
      { q: '¿En qué año se fundó Guayaquil?', a: ['1538', '1492', '1600', '1822'], correct: 0, difficulty: 2, explanation: 'Guayaquil fue fundada en 1538 por Francisco de Orellana.' },
      { q: '¿Qué cultura costera era famosa por su navegación y comercio marítimo?', a: ['Manteña', 'Valdivia', 'Machalilla', 'Chorrera'], correct: 0, difficulty: 3, explanation: 'Los manteños eran grandes navegantes y comerciantes del Pacífico.' },
      { q: '¿Dónde se llevó a cabo la Entrevista de Guayaquil en 1822?', a: ['Guayaquil', 'Quito', 'Lima', 'Bogotá'], correct: 0, difficulty: 1, explanation: 'Bolívar y San Martín se reunieron en Guayaquil en julio de 1822.' }
    ]
  },

  historia_amazonica: {
    name: 'Historia Amazónica del Ecuador',
    icon: IconTree,
    color: 'emerald',
    questions: [
      { q: '¿Quién fue el primer europeo en recorrer el río Amazonas desde Ecuador?', a: ['Francisco de Orellana', 'Gonzalo Pizarro', 'Hernán Cortés', 'Sebastián de Belalcázar'], correct: 0, difficulty: 2, explanation: 'Francisco de Orellana navegó el Amazonas en 1542 partiendo desde Quito.' },
      { q: '¿En qué año Ecuador perdió gran parte de su territorio amazónico con el Protocolo de Río de Janeiro?', a: ['1942', '1830', '1904', '1998'], correct: 0, difficulty: 3, explanation: 'El Protocolo de Río de Janeiro de 1942 estableció los límites con Perú.' },
      { q: '¿Qué pueblo indígena amazónico es conocido por su resistencia al contacto exterior?', a: ['Tagaeri', 'Shuar', 'Achuar', 'Siona'], correct: 0, difficulty: 2, explanation: 'Los Tagaeri son un grupo en aislamiento voluntario en la Amazonía ecuatoriana.' },
      { q: '¿Qué provincia amazónica es la más grande del Ecuador?', a: ['Pastaza', 'Morona Santiago', 'Napo', 'Orellana'], correct: 0, difficulty: 2, explanation: 'Pastaza es la provincia más extensa del país.' },
      { q: '¿Qué pueblo amazónico fue conocido históricamente como los "jíbaros"?', a: ['Shuar', 'Quichua', 'Cofán', 'Waorani'], correct: 0, difficulty: 2, explanation: 'Los Shuar fueron llamados "jíbaros" por los colonizadores españoles.' }
    ]
  },

  historia_insular: {
    name: 'Historia Insular y Galápagos',
    icon: IconAnchor,
    color: 'orange',
    questions: [
      { q: '¿En qué año fueron descubiertas las Islas Galápagos?', a: ['1535', '1492', '1600', '1820'], correct: 0, difficulty: 2, explanation: 'El obispo Tomás de Berlanga descubrió las Galápagos accidentalmente en 1535.' },
      { q: '¿Quién visitó Galápagos y desarrolló su teoría de la evolución?', a: ['Charles Darwin', 'Alexander von Humboldt', 'Isaac Newton', 'Louis Pasteur'], correct: 0, difficulty: 1, explanation: 'Darwin visitó las islas en 1835 y sus observaciones inspiraron la teoría de la evolución.' },
      { q: '¿Cuándo pasaron las Galápagos a ser parte del Ecuador?', a: ['1832', '1822', '1830', '1845'], correct: 0, difficulty: 3, explanation: 'Ecuador anexó las Islas Galápagos en 1832, dos años después de su fundación.' },
      { q: '¿Qué organización declaró a Galápagos Patrimonio Natural de la Humanidad?', a: ['UNESCO', 'ONU', 'OEA', 'WWF'], correct: 0, difficulty: 1, explanation: 'La UNESCO declaró a Galápagos Patrimonio Natural de la Humanidad en 1978.' },
      { q: '¿Qué animal es símbolo emblemático de las Islas Galápagos?', a: ['Tortuga gigante', 'Iguana marina', 'Pingüino de Galápagos', 'Lobo marino'], correct: 0, difficulty: 1, explanation: 'La tortuga gigante es el animal más icónico y representativo de las islas.' }
    ]
  }
};

export const promptTemplateRuleta = `
Tu tarea es actuar como un **creador de contenido educativo viral** y generar un listado de actividades de aprendizaje innovadoras.
Debes fusionar el contenido académico de diferentes materias con el formato y estilo de las redes sociales más populares (TikTok, Instagram/Stories/Reels/Carrusel, X/Twitter, YouTube Shorts).

**¡INSTRUCCIÓN CRÍTICA!**
**Debes generar ÚNICAMENTE Y EXCLUSIVAMENTE el objeto JSON que se especifica a continuación. No incluyas ningún texto, explicación, preámbulo, comentario, o cualquier carácter que no forme parte del JSON final (incluyendo frases como 'A continuación te ayudo', 'Aquí tienes el JSON', etc.).**

**Estructura del JSON Requerido:**

* **Formato:** Un único array de objetos (la lista de materias).
* **Restricción:** El resultado debe ser en formato JSON estricto.

**Cada objeto de materia debe incluir:**
1.  \`id\`: (numérico, consecutivo, comenzando en 1).
2.  \`nombre\`: El nombre de la materia.
3.  \`emoji\`: Un emoji representativo de la materia.
4.  \`color\`: Un color en formato hexadecimal estricto (\`#RRGGBB\`).
5.  \`actividades\`: Un array de objetos con las tareas.

**Cada objeto dentro del array \`actividades\` debe incluir:**
1.  \`texto\`: La descripción de la actividad. Debe especificar claramente el tipo de red social/formato, la materia aplicada, ser creativo, motivacional y orientado a la viralidad.
2.  \`puntos\`: Un valor numérico entero entre 3 y 5 (5 es el más complejo/impactante).

**Temas a considerar para las materias (exactamente 6 materias en este orden):**
* Historia del Ecuador (emoji: 🇪🇨, enfocado en independencia, Revolución Liberal, personajes como Eloy Alfaro y Manuela Sáenz)
* Historia Andina del Ecuador (emoji: 🏔️, enfocado en culturas Quitu-Cara, Cañari, Rumiñahui, Imperio Inca en Ecuador)
* Historia Costeña del Ecuador (emoji: 🌅, enfocado en cultura Valdivia, fundación de Guayaquil, cultura Manteña, Entrevista de Guayaquil)
* Historia Amazónica del Ecuador (emoji: 🌿, enfocado en Francisco de Orellana, pueblos Shuar y Waorani, Protocolo de Río de Janeiro)
* Historia Insular y Galápagos (emoji: 🐢, enfocado en descubrimiento de las islas, Darwin, anexión al Ecuador, Patrimonio UNESCO)
* Democracia y Ciudadanía (emoji: 🏛️, enfocado en participación ciudadana, derechos, deberes y procesos electorales en Ecuador)

**¡Ejemplo de Estilo de Actividad a Seguir!**
\`texto\`: '🎥 TikTok histórico: Graba un video de 60 segundos interpretando a Eloy Alfaro explicando por qué lideró la Revolución Liberal. Usa un fondo épico y música dramática.'
\`puntos\`: 5

**INICIA LA RESPUESTA DIRECTAMENTE CON EL CARÁCTER DE APERTURA DEL JSON (\`[\`) Y NADA MÁS.**
`;
/*
export const MATERIAS = [
  { 
    id: 1, 
    nombre: 'Matemáticas', 
    emoji: '🔢', 
    color: '#4A90E2',
    actividades: [
      { texto: '📸 Post estilo Instagram: Crea una historia visual resolviendo una ecuación paso a paso. Usa stickers y texto creativo para hacerla viral entre tus compañeros.', puntos: 4 },
      { texto: '🎬 TikTok educativo: Graba un video de 60 segundos explicando un "hack matemático" que uses para calcular porcentajes rápido. Usa música de fondo y transiciones.', puntos: 5 },
      { texto: '📊 Reto viral: Publica una encuesta en el grupo preguntando "¿Cuál es tu fórmula matemática favorita?" y comparte los resultados con un gráfico creativo.', puntos: 3 },
      { texto: '💬 Thread educativo: Crea una secuencia de 3 posts explicando cómo usar las fracciones en la vida real (cocina, videojuegos, etc.). Usa emojis y ejemplos cool.', puntos: 4 },
    ]
  },
  { 
    id: 2, 
    nombre: 'Lenguaje', 
    emoji: '📚', 
    color: '#E24A4A',
    actividades: [
      { texto: '📖 BookTok: Graba un video estilo TikTok recomendando tu libro favorito en 30 segundos. Hazlo dramático y emocionante para enganchar a tus seguidores.', puntos: 5 },
      { texto: '✍️ Escritura viral: Escribe un micro-relato de terror o suspenso de máximo 280 caracteres (estilo Twitter/X) y publícalo con hashtags creativos.', puntos: 3 },
      { texto: '🎭 Trend literario: Graba un video actuando una escena de tu obra literaria favorita. Usa efectos y filtros para hacerlo más épico.', puntos: 5 },
      { texto: '📝 Meme educativo: Crea un meme usando figuras literarias (metáfora, hipérbole, etc.) que sea gracioso y educativo. Compártelo en el grupo.', puntos: 3 },
    ]
  },
  { 
    id: 3, 
    nombre: 'Ciencias', 
    emoji: '🔬', 
    color: '#50C878',
    actividades: [
      { texto: '🧪 Experimento viral: Graba un experimento científico casero estilo YouTube (volcán de bicarbonato, etc.) y explica la reacción química. Bonus: efectos de edición.', puntos: 5 },
      { texto: '🌍 Post informativo: Crea un carrusel de Instagram con 5 datos impactantes sobre el cambio climático. Usa diseño atractivo y fuentes que llamen la atención.', puntos: 4 },
      { texto: '🔬 Challenge científico: Inicia un reto: "Menciona un científico que admires y por qué". Etiqueta a 3 compañeros para que continúen la cadena.', puntos: 3 },
      { texto: '⚡ Dato curioso viral: Graba un video tipo "Sabías que..." con un dato científico sorprendente. Usa música épica y revelación dramática al final.', puntos: 4 },
    ]
  },
  { 
    id: 4, 
    nombre: 'Historia', 
    emoji: '📜', 
    color: '#D4A574',
    actividades: [
      { texto: '🎥 Documental express: Graba un mini-documental de 2 minutos sobre un evento histórico importante usando fotos, narración y música de fondo dramática.', puntos: 5 },
      { texto: '📱 Historia en Stories: Crea 5 stories contando un evento histórico como si fuera noticia de última hora con encuestas interactivas y preguntas.', puntos: 4 },
      { texto: '🕰️ Time travel post: Publica qué época histórica visitarías y por qué, con una imagen o video editado donde "aparezcas" en esa época.', puntos: 4 },
      { texto: '👥 Trend histórico: Recrea un meme famoso pero con personajes históricos. Ejemplo: "Expectativa vs Realidad" con Simón Bolívar o Cleopatra.', puntos: 3 },
    ]
  },
  { 
    id: 5, 
    nombre: 'Arte', 
    emoji: '🎨', 
    color: '#E67EB4',
    actividades: [
      { texto: '🎨 Speed art video: Graba en timelapse cómo creas una obra de arte (dibujo, pintura, digital). Usa música trending y muestra el antes/después.', puntos: 5 },
      { texto: '🖼️ Galería virtual: Crea un carrusel de Instagram mostrando 3 obras de arte que te inspiran y explica por qué en los captions.', puntos: 3 },
      { texto: '✨ Desafío artístico: Inicia el "Art Challenge": dibuja algo con los ojos cerrados, grábate y reta a tus compañeros a hacerlo mejor.', puntos: 4 },
      { texto: '🎭 Filtro creativo: Usa o crea un filtro de Instagram/Snapchat inspirado en un movimiento artístico (surrealismo, pop art) y tómate una selfie creativa.', puntos: 4 },
    ]
  },
  { 
    id: 6, 
    nombre: 'Educación Física', 
    emoji: '⚽', 
    color: '#FF8C42',
    actividades: [
      { texto: '💪 Fitness Challenge: Graba un video haciendo un reto físico (plancha, sentadillas, etc.) y reta a tus amigos a superarte. Usa hashtags fitness.', puntos: 4 },
      { texto: '⚽ Trick shot: Graba tu mejor jugada o truco deportivo en cámara lenta con música épica. Puede ser con cualquier deporte o actividad física.', puntos: 5 },
      { texto: '🏃 Rutina viral: Crea y comparte una rutina de ejercicios de 1 minuto que se pueda hacer en casa. Hazlo dinámico con cortes rápidos de video.', puntos: 4 },
      { texto: '📊 Progreso deportivo: Publica tu "antes y después" de alguna habilidad deportiva que hayas mejorado. Inspira a otros con tu dedicación.', puntos: 3 },
    ]
  },
];
*/
export const MATERIAS = [
  { 
    id: 1, 
    nombre: 'Historia del Ecuador', 
    emoji: '🇪🇨', 
    color: '#D4A574',
    actividades: [
      { texto: '🎥 Mini documental: Crea un video de 2 minutos explicando un acontecimiento clave de la historia ecuatoriana (Independencia, Revolución Liberal, etc.). Usa narración dramática y música épica.', puntos: 5 },
      { texto: '📰 Noticia histórica: Presenta el Primer Grito de Independencia del 10 de agosto de 1809 como si fuera una noticia de última hora. Incluye titulares llamativos y entrevistas ficticias.', puntos: 4 },
      { texto: '🕰️ Línea del tiempo creativa: Diseña una línea del tiempo visual con los momentos clave desde la colonia hasta la fundación de la República del Ecuador en 1830.', puntos: 4 },
      { texto: '👥 Debate histórico: ¿Fue Eloy Alfaro el presidente más importante del Ecuador? Publica tu argumento y genera debate en comentarios con evidencia histórica.', puntos: 3 },
    ]
  },
  { 
    id: 2, 
    nombre: 'Historia Andina del Ecuador', 
    emoji: '🏔️', 
    color: '#6C5CE7',
    actividades: [
      { texto: '🌎 Culturas serranas: Crea un post comparando la cultura Quitu-Cara con la cultura Cañari, destacando diferencias y similitudes en su organización social.', puntos: 4 },
      { texto: '🎬 Personaje andino: Graba un video interpretando a Rumiñahui contando su resistencia ante la conquista española en primera persona.', puntos: 5 },
      { texto: '📚 Top 5 andino: Publica un ranking de los 5 eventos más importantes de la historia andina ecuatoriana y justifica tu elección.', puntos: 4 },
      { texto: '🧠 Trivia serrana: Crea un quiz interactivo con 5 preguntas sobre las culturas prehispánicas de la Sierra ecuatoriana y reta a tus compañeros.', puntos: 3 },
    ]
  },
  { 
    id: 3, 
    nombre: 'Historia Costeña del Ecuador', 
    emoji: '🌅', 
    color: '#00B894',
    actividades: [
      { texto: '🎤 Cultura costera: Crea un video contando la historia de la cultura Valdivia, considerada la más antigua de América por su cerámica.', puntos: 5 },
      { texto: '📜 Fundación de Guayaquil: Diseña un carrusel explicando la fundación de Guayaquil en 1538 y su importancia como puerto principal de la Audiencia de Quito.', puntos: 4 },
      { texto: '🎭 Entrevista histórica: Representa la Entrevista de Guayaquil de 1822 entre Bolívar y San Martín y explica su trascendencia para América del Sur.', puntos: 5 },
      { texto: '📊 Impacto actual: Explica cómo la cultura Manteña y su tradición marítima influyó en la identidad costeña ecuatoriana actual.', puntos: 4 },
    ]
  },
  { 
    id: 4, 
    nombre: 'Historia Amazónica del Ecuador', 
    emoji: '🌿', 
    color: '#E17055',
    actividades: [
      { texto: '📺 Orellana y el Amazonas: Explica en un video el recorrido de Francisco de Orellana en 1542 navegando el río Amazonas desde territorio ecuatoriano.', puntos: 5 },
      { texto: '🎥 Pueblos amazónicos: Crea un post presentando a los pueblos indígenas de la Amazonía ecuatoriana (Shuar, Waorani, Tagaeri) y su historia de resistencia.', puntos: 4 },
      { texto: '🌐 Protocolo de Río: Resume en un video de 60 segundos qué fue el Protocolo de Río de Janeiro de 1942 y cómo afectó al territorio amazónico ecuatoriano.', puntos: 4 },
      { texto: '📱 Amazonía hoy: Explica cómo los conflictos históricos por el territorio amazónico siguen afectando a las comunidades indígenas en la actualidad.', puntos: 3 },
    ]
  },
  { 
    id: 5, 
    nombre: 'Historia Insular y Galápagos', 
    emoji: '🐢', 
    color: '#1F618D',
    actividades: [
      { texto: '🗺️ Descubrimiento de Galápagos: Crea un video explicando cómo el obispo Tomás de Berlanga descubrió accidentalmente las islas en 1535 y qué encontró.', puntos: 5 },
      { texto: '🔬 Darwin en Galápagos: Diseña un carrusel explicando qué observó Charles Darwin en las islas en 1835 y cómo eso inspiró la teoría de la evolución.', puntos: 4 },
      { texto: '🏝️ Anexión al Ecuador: Explica en un post por qué Ecuador anexó las Galápagos en 1832 y qué importancia estratégica tienen las islas para el país.', puntos: 4 },
      { texto: '📰 Patrimonio mundial: Analiza por qué la UNESCO declaró a Galápagos Patrimonio Natural de la Humanidad en 1978 y qué desafíos enfrenta hoy su conservación.', puntos: 3 },
    ]
  },
  { 
    id: 6, 
    nombre: 'Democracia y Ciudadanía', 
    emoji: '🏛️', 
    color: '#117A65',
    actividades: [
      { texto: '🗳️ Simulación electoral: Organiza una votación en clase sobre un tema interesante y explica cómo funciona el proceso democrático.', puntos: 5 },
      { texto: '📜 ¿Qué es democracia?: Crea un video corto explicando qué significa vivir en un país democrático y menciona 3 características principales.', puntos: 4 },
      { texto: '👥 Derechos y deberes: Diseña un carrusel mostrando 3 derechos y 3 deberes de los ciudadanos ecuatorianos.', puntos: 4 },
      { texto: '📰 Noticia política: Analiza una noticia nacional relacionada con participación ciudadana en Ecuador y explica su importancia.', puntos: 3 },
    ]
  },
];

export const promptTemplateBingo1 = "Genera un objeto JSON. El objeto debe contener las siguientes claves (materias): 'ESPANOL', 'MATEMATICAS', 'CIENCIAS', 'SOCIALES', y 'ARTES'. A cada clave asígnale un array que contenga 8 actividades de tarea o estudio relacionadas con esa materia. Las actividades deben ser variadas y adecuadas para un nivel de primaria o secundaria inicial. SOLO proporciona el objeto JSON, sin ninguna explicación ni texto adicional.";

export const ACCIONES_BASE = {
  HISTORIA: [
    'Crea una línea de tiempo de la Independencia',
    'Investiga el papel de Simón Bolívar',
    'Analiza las causas de la Revolución Francesa',
    'Compara el colonialismo español y portugués',
    'Explica las consecuencias de la Revolución Industrial',
    'Describe la vida cotidiana en el Ecuador colonial',
    'Investiga la Batalla de Pichincha',
    'Analiza el sistema de haciendas en el siglo XIX',
  ],

  HISTORIA_UNIVERSAL: [
    'Analiza las causas de la Primera Guerra Mundial',
    'Explica las consecuencias de la Segunda Guerra Mundial',
    'Investiga el Imperio Romano',
    'Describe la caída del Imperio Romano',
    'Analiza la Guerra Fría',
    'Investiga el Renacimiento',
    'Explica la Revolución Rusa',
    'Describe el feudalismo en la Edad Media'
  ],

  HISTORIA_LATINOAMERICANA: [
    'Investiga la independencia de México',
    'Analiza la independencia de Argentina',
    'Compara los procesos independentistas en América Latina',
    'Explica la Doctrina Monroe',
    'Investiga las dictaduras en América Latina en el siglo XX',
    'Describe el papel de José de San Martín',    
    'Investiga qué fue la Ilustración',
    'Explica el Primer Grito de Independencia del 10 de agosto de 1809',
  ],

  HISTORIA_CONTEMPORANEA: [
    'Analiza la globalización',
    'Investiga la creación de la ONU',
    'Explica la caída del Muro de Berlín',
    'Describe los avances tecnológicos del siglo XX',
    'Investiga los movimientos sociales del siglo XXI',
    'Escribe un diario desde la perspectiva de un patriota de 1820',
    'Explica el proceso de formación del Estado ecuatoriano'
  ]
};

/*
export const ACCIONES_BASE = {
  ESPANOL: [
    'Escribe una mini historia',
    'Lee un poema en voz alta',
    'Escribe 5 palabras nuevas',
    'Corrige un texto con errores',
    'Inventa un refrán',
    'Describe tu lugar favorito',
    'Escribe una carta a un amigo',
    'Crea un acróstico'
  ],
  MATEMATICAS: [
    'Resuelve 3 ejercicios de suma mental',
    'Aprende una tabla de multiplicar',
    'Calcula el perímetro de tu pupitre',
    'Juega con fracciones',
    'Resuelve un problema de división',
    'Mide 5 objetos de tu casa',
    'Crea un patrón numérico',
    'Cuenta de 3 en 3 hasta 60'
  ],
  CIENCIAS: [
    'Observa una planta y dibújala',
    'Describe el clima de hoy',
    'Mide la temperatura',
    'Explica cómo se forma la lluvia',
    'Identifica 3 animales locales',
    'Experimenta con agua y aceite',
    'Observa el cielo nocturno',
    'Clasifica 5 objetos por material'
  ],
  SOCIALES: [
    'Investiga un héroe local',
    'Menciona 3 provincias',
    'Busca un país en el mapa',
    'Habla de tu familia',
    'Describe una tradición local',
    'Dibuja tu árbol genealógico',
    'Investiga sobre Simón Bolívar',
    'Menciona 3 ríos de Ecuador'
  ],
  ARTES: [
    'Dibuja algo sobre tu día',
    'Crea una canción corta',
    'Haz una figura con papel',
    'Pinta una emoción',
    'Construye algo con material reciclado',
    'Diseña un logo para tu clase',
    'Crea un collage',
    'Baila una canción y descríbela'
  ]
};
*/
export const promptTemplateBingo = `Genera un objeto JSON con actividades educativas para un bingo semanal escolar. 
    
    El formato debe ser:
    {
      "HISTORIA": ["actividad 1", "actividad 2", ...],
      "HISTORIA_UNIVERSAL": ["actividad 1", "actividad 2", ...],
      "HISTORIA_LATINOAMERICANA": ["actividad 1", "actividad 2", ...],
      "HISTORIA_CONTEMPORANEA": ["actividad 1", "actividad 2", ...]
    }
    
    Genera exactamente 5 actividades diferentes para cada materia. Las actividades deben ser:
    - Apropiadas para estudiantes de secundaria
    - Variadas (lecturas, ejercicios, proyectos, investigaciones)
    - Específicas y claras
    - Realizables en una semana
    
    Responde SOLO con el objeto JSON, sin texto adicional.`;

export const promptTemplateRaspa = `Genera la lista de 5 categorías de misiones educativas (Historia General, Historia Universal, Historia Latinoamericana, Historia Contemporanea) con 3 misiones cada una. El output debe ser únicamente el objeto JSON, garantizando que los campos id de las categorías sean exactamente math, historia_ecuador, historia_universal, historia_latinoamericana, y historia_contemporanea. La estructura debe usar: id de categoría (string), name, icon, color, y missions donde el campo id de la misión sea un valor numérico, junto con question, answer (string en minúsculas, sin tildes) y points (número), sin ningún texto, comentario o explicación adicional.`;

/*
export const MATERIAS_DEFAULT : Subject[] = [
  { 
    id: 'math', 
    name: 'Matemáticas', 
    icon: '📘',
    color: 'blue',
    missions: [
      { id: 1, question: 'Resuelve: 25 × 3 – 15 = ?', answer: '60', points: 10 },
      { id: 2, question: 'Calcula: 144 ÷ 12 = ?', answer: '12', points: 10 },
      { id: 3, question: 'Si tienes $50 y gastas $23, ¿cuánto te queda?', answer: '27', points: 15 }
    ]
  },
  { 
    id: 'language', 
    name: 'Lengua', 
    icon: '📗',
    color: 'green',
    missions: [
      { id: 1, question: '¿Cuántas vocales tiene la palabra "educación"? (escribe el número)', answer: '5', points: 5 },
      { id: 2, question: 'Completa: El plural de "pez" es ___', answer: 'peces', points: 10 },
      { id: 3, question: '¿Cuál es el sinónimo de "feliz"? (contento/triste)', answer: 'contento', points: 10 }
    ]
  },
  { 
    id: 'social', 
    name: 'Ciencias Sociales', 
    icon: '🌎',
    color: 'orange',
    missions: [
      { id: 1, question: '¿En qué continente está Ecuador?', answer: 'america', points: 15 },
      { id: 2, question: '¿Cuál es la capital de Francia?', answer: 'paris', points: 10 },
      { id: 3, question: 'Comparte un dato curioso sobre tu ciudad (escribe: "compartido")', answer: 'compartido', points: 15 }
    ]
  },
  { 
    id: 'science', 
    name: 'Ciencias Naturales', 
    icon: '🔬',
    color: 'teal',
    missions: [
      { id: 1, question: '¿Cuántos planetas tiene el sistema solar?', answer: '8', points: 10 },
      { id: 2, question: '¿Qué necesitan las plantas para hacer fotosíntesis? (luz/oscuridad)', answer: 'luz', points: 10 },
      { id: 3, question: 'Observa algo vivo en tu casa (escribe: "observado")', answer: 'observado', points: 10 }
    ]
  },
  { 
    id: 'art', 
    name: 'Arte', 
    icon: '🎨',
    color: 'pink',
    missions: [
      { id: 1, question: '¿Cuántos colores primarios hay?', answer: '3', points: 10 },
      { id: 2, question: 'Crea un dibujo (escribe: "dibujado")', answer: 'dibujado', points: 20 },
      { id: 3, question: '¿Rojo + Amarillo = ? (naranja/verde)', answer: 'naranja', points: 15 }
    ]
  }
];*/

export const MATERIAS_DEFAULT: Subject[] = [
  { 
    id: 'historia_ecuador', 
    name: 'Historia Ecuador', 
    icon: '🏛️',
    color: 'violet',
    missions: [
      { id: 1, question: '¿En qué año fue el Primer Grito de Independencia de Ecuador?', answer: '1809', points: 15 },
      { id: 2, question: '¿Quién fue Manuela Cañizares?', answer: 'patriota', points: 15 },
      { id: 3, question: '¿En qué año fue la Batalla de Pichincha?', answer: '1822', points: 20 }
    ]
  },

  { 
    id: 'historia_universal', 
    name: 'Historia Universal', 
    icon: '🌍',
    color: 'blue',
    missions: [
      { id: 1, question: '¿En qué año comenzó la Primera Guerra Mundial?', answer: '1914', points: 15 },
      { id: 2, question: '¿Qué imperio construyó el Coliseo Romano?', answer: 'romano', points: 10 },
      { id: 3, question: '¿En qué país comenzó la Revolución Francesa?', answer: 'francia', points: 15 }
    ]
  },

  { 
    id: 'historia_latinoamericana', 
    name: 'Historia Latinoamericana', 
    icon: '🌎',
    color: 'orange',
    missions: [
      { id: 1, question: '¿Quién lideró la independencia de Argentina?', answer: 'san martin', points: 15 },
      { id: 2, question: '¿Qué país fue gobernado por Porfirio Díaz?', answer: 'mexico', points: 15 },
      { id: 3, question: '¿Qué libertador participó en la independencia de varios países sudamericanos?', answer: 'bolivar', points: 20 }
    ]
  },

  { 
    id: 'historia_contemporanea', 
    name: 'Historia Contemporánea', 
    icon: '🕰️',
    color: 'green',
    missions: [
      { id: 1, question: '¿En qué año cayó el Muro de Berlín?', answer: '1989', points: 20 },
      { id: 2, question: '¿Qué organización se creó después de la Segunda Guerra Mundial para mantener la paz?', answer: 'onu', points: 15 },
      { id: 3, question: '¿Qué conflicto enfrentó a Estados Unidos y la Unión Soviética sin guerra directa?', answer: 'guerra fria', points: 20 }
    ]
  }
];


// Mock data basado en tu API response
export const mockData = {
  estadisticasGenerales: {
    totalUsuarios: 150,
    totalTransacciones: 3847,
    totalLogros: 45,
    totalDesafios: 12,
    puntosDistribuidosTotal: 125340,
    tasaParticipacion: 67.5,
    topUsuarios: [
      {
        usuarioId: 1,
        nombreUsuario: 'Juan Veliz',
        totalPuntos: 12500,
        posicion: 1,
      },
      {
        usuarioId: 45,
        nombreUsuario: 'María Torres',
        totalPuntos: 11200,
        posicion: 2,
      },
      {
        usuarioId: 23,
        nombreUsuario: 'Carlos Mendoza',
        totalPuntos: 9850,
        posicion: 3,
      },
      {
        usuarioId: 78,
        nombreUsuario: 'Sofía Ramírez',
        totalPuntos: 8920,
        posicion: 4,
      },
      {
        usuarioId: 12,
        nombreUsuario: 'Luis Herrera',
        totalPuntos: 7640,
        posicion: 5,
      },
    ],
  },

  resumenUsuario: {
    usuarioId: 1,
    nombreUsuario: "Juan Veliz",
    puntosPorTipo: [
      {
        tipoId: 1,
        tipoNombre: 'TRIVIA',
        nombreMostrar: 'Puntos de Trivia',
        cantidad: 600,
        porcentaje: 92.31,
      },
      {
        tipoId: 2,
        tipoNombre: 'RASPA_GANA',
        nombreMostrar: 'Puntos de Raspa Gana',
        cantidad: 50,
        porcentaje: 7.69,
      },
    ],
    logrosDesbloqueados: 3,
    desafiosCompletados: 2,
    ultimaActividad: '2025-11-13T14:30:00',
    posicionRanking: 1,
  },

  distribucionPuntos: {
    distribucionPorTipo: [
      {
        tipoId: 1,
        tipoNombre: 'TRIVIA',
        nombreMostrar: 'Puntos de Trivia',
        cantidad: 45800,
        porcentaje: 73.28,
      },
      {
        tipoId: 2,
        tipoNombre: 'RASPA_GANA',
        nombreMostrar: 'Puntos de Raspa Gana',
        cantidad: 16700,
        porcentaje: 26.72,
      },
    ],
    distribucionPorFecha: [
      {
        fecha: '2025-11-09T00:00:00',
        puntosGanados: 2340,
        puntosGastados: 150,
        balance: 2190,
      },
      {
        fecha: '2025-11-10T00:00:00',
        puntosGanados: 3120,
        puntosGastados: 300,
        balance: 2820,
      },
      {
        fecha: '2025-11-11T00:00:00',
        puntosGanados: 2890,
        puntosGastados: 450,
        balance: 2440,
      },
      {
        fecha: '2025-11-12T00:00:00',
        puntosGanados: 4560,
        puntosGastados: 200,
        balance: 4360,
      },
      {
        fecha: '2025-11-13T00:00:00',
        puntosGanados: 3780,
        puntosGastados: 600,
        balance: 3180,
      },
      {
        fecha: '2025-11-14T00:00:00',
        puntosGanados: 1890,
        puntosGastados: 100,
        balance: 1790,
      },
    ],
    totalPuntosGanados: 62500,
    totalPuntosGastados: 4320,
    balanceTotal: 58180,
  },

  estadisticasLogros: {
    totalLogros: 45,
    logrosActivos: 42,
    logrosPorRareza: [
      { rareza: 'COMUN', cantidad: 18, porcentaje: 40.0 },
      { rareza: 'RARO', cantidad: 15, porcentaje: 33.33 },
      { rareza: 'EPICO', cantidad: 8, porcentaje: 17.78 },
      { rareza: 'LEGENDARIO', cantidad: 4, porcentaje: 8.89 },
    ],
    logrosPopulares: [
      {
        logroId: 1,
        nombre: 'Leyenda Oculta',
        descripcion: 'Descubre el secreto final',
        rareza: 'LEGENDARIO',
        vecesDesbloqueado: 127,
        tasaDesbloqueo: 84.67,
      },
      {
        logroId: 5,
        nombre: 'Maestro de Trivias',
        descripcion: 'Responde 100 trivias correctamente',
        rareza: 'EPICO',
        vecesDesbloqueado: 98,
        tasaDesbloqueo: 65.33,
      },
      {
        logroId: 12,
        nombre: 'Afortunado',
        descripcion: 'Gana 10 veces en Raspa Gana',
        rareza: 'RARO',
        vecesDesbloqueado: 145,
        tasaDesbloqueo: 96.67,
      },
      {
        logroId: 3,
        nombre: 'Primer Paso',
        descripcion: 'Completa tu primera actividad',
        rareza: 'COMUN',
        vecesDesbloqueado: 150,
        tasaDesbloqueo: 100.0,
      },
    ],
    tasaDesbloqueoPromedio: 45.67,
  },

  desafiosActivos: {
    desafiosDiarios: [
      {
        desafioId: 5,
        titulo: 'Reto Matutino',
        descripcion: 'Completa 5 trivias antes del mediodía',
        dificultad: 'FACIL',
        participantesActuales: 23,
        maxParticipantes: 5,
        fechaInicio: '2025-11-14T00:00:00',
        fechaFin: '2025-11-14T23:59:59',
        tipoDesafio: 'Diario',
      },
      {
        desafioId: 8,
        titulo: 'Coleccionista Diario',
        descripcion: 'Obtén 3 logros diferentes hoy',
        dificultad: 'MEDIO',
        participantesActuales: 15,
        maxParticipantes: 5,
        fechaInicio: '2025-11-14T00:00:00',
        fechaFin: '2025-11-14T23:59:59',
        tipoDesafio: 'Diario',
      },
    ],
    desafiosSemanales: [
      {
        desafioId: 3,
        titulo: 'Maratón Semanal',
        descripcion: 'Acumula 500 puntos esta semana',
        dificultad: 'MEDIO',
        participantesActuales: 67,
        maxParticipantes: 5,
        fechaInicio: '2025-11-11T00:00:00',
        fechaFin: '2025-11-17T23:59:59',
        tipoDesafio: 'Semanal',
      },
      {
        desafioId: 6,
        titulo: 'Racha de Campeón',
        descripcion: 'Mantén una racha de 7 días',
        dificultad: 'DIFICIL',
        participantesActuales: 34,
        maxParticipantes: 5,
        fechaInicio: '2025-11-11T00:00:00',
        fechaFin: '2025-11-17T23:59:59',
        tipoDesafio: 'Semanal',
      },
    ],
    desafiosEspeciales: [
      {
        desafioId: 1,
        titulo: 'Torneo de Velocidad',
        descripcion: 'Compite contra otros en desafíos cronometrados',
        dificultad: 'DIFICIL',
        participantesActuales: 89,
        maxParticipantes: 100,
        fechaInicio: '2025-11-01T00:00:00',
        fechaFin: '2025-12-01T23:59:59',
        tipoDesafio: 'Torneo',
      },
    ],
    totalParticipantes: 228,
  },

  transaccionesRecientes: {
    transacciones: [
      {
        transaccionId: 4,
        usuarioId: 1,
        nombreUsuario: 'Juan Veliz',
        tipoTransaccion: 'GASTAR',
        cantidad: -25,
        tipoPunto: 'Puntos de Raspa Gana',
        descripcion: 'Canje de recompensa',
        fecha: '2025-11-13T10:30:00',
      },
      {
        transaccionId: 3,
        usuarioId: 1,
        nombreUsuario: 'Juan Veliz',
        tipoTransaccion: 'GANAR',
        cantidad: 50,
        tipoPunto: 'Puntos de Raspa Gana',
        descripcion: 'Monedas por desbloquear logro',
        fecha: '2025-11-10T15:45:00',
      },
      {
        transaccionId: 2,
        usuarioId: 1,
        nombreUsuario: 'Juan Veliz',
        tipoTransaccion: 'BONUS',
        cantidad: 500,
        tipoPunto: 'Puntos de Trivia',
        descripcion: 'Bonus por racha de 7 días',
        fecha: '2025-11-11T08:20:00',
      },
      {
        transaccionId: 1,
        usuarioId: 1,
        nombreUsuario: 'Juan Veliz',
        tipoTransaccion: 'GANAR',
        cantidad: 100,
        tipoPunto: 'Puntos de Trivia',
        descripcion: 'Puntos por completar primer desafío',
        fecha: '2025-11-09T12:00:00',
      },
      {
        transaccionId: 156,
        usuarioId: 23,
        nombreUsuario: 'Carlos Mendoza',
        tipoTransaccion: 'GANAR',
        cantidad: 150,
        tipoPunto: 'Puntos de Trivia',
        descripcion: 'Trivia completada exitosamente',
        fecha: '2025-11-08T16:30:00',
      },
    ],
    totalTransacciones: 3847,
  },

  actividadUsuario: {
    usuarioId: 1,
    actividadPorDia: [
      {
        fecha: '2025-11-08T00:00:00',
        transacciones: 5,
        puntosGanados: 250,
        logrosDesbloqueados: 1,
        activo: true,
      },
      {
        fecha: '2025-11-09T00:00:00',
        transacciones: 8,
        puntosGanados: 420,
        logrosDesbloqueados: 2,
        activo: true,
      },
      {
        fecha: '2025-11-10T00:00:00',
        transacciones: 3,
        puntosGanados: 180,
        logrosDesbloqueados: 0,
        activo: true,
      },
      {
        fecha: '2025-11-11T00:00:00',
        transacciones: 12,
        puntosGanados: 890,
        logrosDesbloqueados: 3,
        activo: true,
      },
      {
        fecha: '2025-11-12T00:00:00',
        transacciones: 6,
        puntosGanados: 340,
        logrosDesbloqueados: 1,
        activo: true,
      },
      {
        fecha: '2025-11-13T00:00:00',
        transacciones: 9,
        puntosGanados: 520,
        logrosDesbloqueados: 2,
        activo: true,
      },
      {
        fecha: '2025-11-14T00:00:00',
        transacciones: 4,
        puntosGanados: 210,
        logrosDesbloqueados: 0,
        activo: true,
      },
    ],
    diasActivos: 7,
    rachaActual: 7,
    mejorRacha: 12,
  },
};
