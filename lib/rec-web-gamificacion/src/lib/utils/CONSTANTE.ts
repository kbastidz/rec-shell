import { IconBrain, IconBook, IconFlask, IconWorld, IconLanguage, IconTrophy, IconClock, IconCheck, IconX, IconSparkles } from '@tabler/icons-react';

export const promptTemplate = `Actúa como un generador de bancos de preguntas en formato JSON. Tu única salida debe ser el código JSON, sin ninguna explicación, saludo, o texto adicional.

Requerimiento: Genera un único objeto JSON que contenga un banco de preguntas para 5 materias, siguiendo exactamente la siguiente estructura.

Estructura del Objeto JSON (¡Sigue esta estructura al pie de la letra!):

{
  "clave_materia": {
    "name": "Nombre de la Materia",
    "icon": "NombreIcono",
    "color": "color_css",
    "questions": [
      {
        "q": "Texto de la pregunta.",
        "a": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
        "correct": 0,
        "difficulty": 1,
        "explanation": "Explicación breve de la respuesta."
      }
    ]
  }
  // Incluye el resto de las materias aquí...
}

Contenido Específico: Genera un banco de preguntas que incluya cinco materias diferentes, con un límite estricto de 4 preguntas para cada una.

Materias a incluir (con sus claves, nombres, iconos y colores):

Matemáticas (clave: matematicas, nombre: "Matemáticas", ícono: IconBrain, color: blue).
Ciencias Sociales (clave: sociales, nombre: "Ciencias Sociales", ícono: IconWorld, color: green).
Inglés (clave: ingles, nombre: "Inglés", ícono: IconLanguage, color: red).
Ciencias Naturales (clave: ciencias, nombre: "Ciencias Naturales", ícono: IconFlask, color: orange).
Lengua (clave: lengua, nombre: "Lengua", ícono: IconCheck, color: purple).

Cantidad: Genera máximo 4 preguntas para cada una de las 5 materias.
Dificultad: Varía la dificultad entre 1, 2 y 3 en las preguntas de cada materia.
Respuestas: La respuesta correcta (índice 0-3) debe coincidir con el valor en correct.`;

export const SUBJECTS: SubjectsType = {
  matematicas: {
    name: 'Matemáticas',
    icon: IconBrain,
    color: 'blue',
    questions: [
      { q: '¿Cuánto es 15 × 8?', a: ['120', '125', '115', '130'], correct: 0, difficulty: 1, explanation: '15 × 8 = 120' },
      { q: '¿Cuál es el perímetro de un cuadrado con lado de 7cm?', a: ['28cm', '49cm', '14cm', '21cm'], correct: 0, difficulty: 2, explanation: 'Perímetro = 4 × lado = 4 × 7 = 28cm' },
      { q: 'Si x + 12 = 20, ¿cuánto vale x?', a: ['8', '32', '12', '10'], correct: 0, difficulty: 1, explanation: 'x = 20 - 12 = 8' },
      { q: '¿Cuánto es 2³ + 3²?', a: ['17', '15', '19', '13'], correct: 0, difficulty: 2, explanation: '2³ = 8, 3² = 9, entonces 8 + 9 = 17' },
      { q: '¿Cuál es el área de un círculo con radio 5? (usa π ≈ 3.14)', a: ['78.5', '31.4', '15.7', '157'], correct: 0, difficulty: 3, explanation: 'Área = π × r² = 3.14 × 25 = 78.5' },
      { q: '¿Cuántos grados tiene un triángulo?', a: ['180°', '360°', '90°', '270°'], correct: 0, difficulty: 1, explanation: 'La suma de ángulos internos de un triángulo siempre es 180°' },
      { q: '¿Qué fracción es equivalente a 0.75?', a: ['3/4', '2/3', '4/5', '1/2'], correct: 0, difficulty: 2, explanation: '0.75 = 75/100 = 3/4' }
    ]
  },
  lengua: {
    name: 'Lengua',
    icon: IconBook,
    color: 'grape',
    questions: [
      { q: '¿Cuál es el sustantivo en "El gato negro duerme"?', a: ['gato', 'negro', 'duerme', 'el'], correct: 0, difficulty: 1, explanation: 'El sustantivo es la palabra que nombra al ser u objeto: "gato"' },
      { q: '¿Qué tipo de palabra es "rápidamente"?', a: ['Adverbio', 'Adjetivo', 'Verbo', 'Sustantivo'], correct: 0, difficulty: 2, explanation: 'Los adverbios terminados en -mente modifican al verbo' },
      { q: '¿Cuántas sílabas tiene "murciélago"?', a: ['4', '3', '5', '6'], correct: 0, difficulty: 1, explanation: 'mur-cié-la-go = 4 sílabas' },
      { q: '¿Cuál es el sinónimo de "feliz"?', a: ['Contento', 'Triste', 'Enojado', 'Cansado'], correct: 0, difficulty: 1, explanation: 'Sinónimos son palabras con significado similar' },
      { q: '¿Qué signo va en: "Hola __ cómo estás"?', a: [',', '.', ';', ':'], correct: 0, difficulty: 2, explanation: 'La coma separa frases cortas en una oración' },
      { q: '¿Qué es una metáfora?', a: ['Comparación implícita', 'Exageración', 'Repetición', 'Pregunta retórica'], correct: 0, difficulty: 3, explanation: 'La metáfora compara sin usar "como": "tus ojos son estrellas"' }
    ]
  },
  ciencias: {
    name: 'Ciencias',
    icon: IconFlask,
    color: 'green',
    questions: [
      { q: '¿Qué gas respiramos principalmente?', a: ['Oxígeno', 'Hidrógeno', 'Nitrógeno', 'CO₂'], correct: 0, difficulty: 1, explanation: 'Inhalamos oxígeno (O₂) necesario para vivir' },
      { q: '¿Cuántos planetas hay en el Sistema Solar?', a: ['8', '9', '7', '10'], correct: 0, difficulty: 1, explanation: 'Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno' },
      { q: '¿Qué órgano bombea la sangre?', a: ['Corazón', 'Pulmón', 'Hígado', 'Riñón'], correct: 0, difficulty: 1, explanation: 'El corazón bombea sangre a todo el cuerpo' },
      { q: '¿Cuál es la fórmula del agua?', a: ['H₂O', 'CO₂', 'O₂', 'H₂'], correct: 0, difficulty: 2, explanation: 'Dos átomos de hidrógeno y uno de oxígeno' },
      { q: '¿Qué tipo de animal es la ballena?', a: ['Mamífero', 'Pez', 'Reptil', 'Anfibio'], correct: 0, difficulty: 2, explanation: 'Las ballenas son mamíferos marinos que respiran aire' },
      { q: '¿Qué produce la fotosíntesis?', a: ['Oxígeno', 'CO₂', 'Nitrógeno', 'Metano'], correct: 0, difficulty: 2, explanation: 'Las plantas producen oxígeno durante la fotosíntesis' },
      { q: '¿A qué velocidad viaja la luz?', a: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], correct: 0, difficulty: 3, explanation: 'La luz viaja a aprox. 300,000 kilómetros por segundo' }
    ]
  },
  sociales: {
    name: 'Sociales',
    icon: IconWorld,
    color: 'orange',
    questions: [
      { q: '¿Cuál es la capital de Francia?', a: ['París', 'Londres', 'Roma', 'Madrid'], correct: 0, difficulty: 1, explanation: 'París es la capital y ciudad más grande de Francia' },
      { q: '¿En qué continente está Egipto?', a: ['África', 'Asia', 'Europa', 'América'], correct: 0, difficulty: 1, explanation: 'Egipto está en el noreste de África' },
      { q: '¿Quién descubrió América?', a: ['Cristóbal Colón', 'Marco Polo', 'Magallanes', 'Vasco da Gama'], correct: 0, difficulty: 1, explanation: 'Colón llegó a América en 1492' },
      { q: '¿Cuántos continentes hay?', a: ['7', '5', '6', '8'], correct: 0, difficulty: 2, explanation: 'América, Europa, África, Asia, Oceanía, Antártida, divididos en N y S América' },
      { q: '¿Qué océano está entre América y Europa?', a: ['Atlántico', 'Pacífico', 'Índico', 'Ártico'], correct: 0, difficulty: 2, explanation: 'El Océano Atlántico separa estos dos continentes' },
      { q: '¿En qué año cayó el Muro de Berlín?', a: ['1989', '1991', '1985', '1979'], correct: 0, difficulty: 3, explanation: 'El Muro de Berlín cayó el 9 de noviembre de 1989' }
    ]
  },
  ingles: {
    name: 'Inglés',
    icon: IconLanguage,
    color: 'red',
    questions: [
      { q: '¿Cómo se dice "libro" en inglés?', a: ['Book', 'Look', 'Cook', 'Hook'], correct: 0, difficulty: 1, explanation: '"Book" significa libro en inglés' },
      { q: '¿Qué significa "cat"?', a: ['Gato', 'Perro', 'Pájaro', 'Ratón'], correct: 0, difficulty: 1, explanation: '"Cat" es gato en español' },
      { q: '¿Cuál es el plural de "child"?', a: ['Children', 'Childs', 'Childes', 'Childen'], correct: 0, difficulty: 2, explanation: '"Child" (niño) tiene un plural irregular: "children"' },
      { q: '¿Qué significa "I am hungry"?', a: ['Tengo hambre', 'Estoy feliz', 'Tengo sueño', 'Estoy cansado'], correct: 0, difficulty: 1, explanation: '"Hungry" significa hambriento/a' },
      { q: '¿Cómo se dice "buenos días" en inglés?', a: ['Good morning', 'Good night', 'Good afternoon', 'Good evening'], correct: 0, difficulty: 1, explanation: '"Good morning" se usa para saludar en la mañana' },
      { q: '¿Cuál es el pasado de "go"?', a: ['Went', 'Goed', 'Gone', 'Goes'], correct: 0, difficulty: 2, explanation: '"Go" (ir) tiene pasado irregular: "went"' },
      { q: 'What is the opposite of "hot"?', a: ['Cold', 'Warm', 'Cool', 'Mild'], correct: 0, difficulty: 2, explanation: '"Cold" (frío) es lo opuesto de "hot" (caliente)' }
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

**Temas a considerar para las materias (mínimo 5 materias):**
* Ciencias Sociales/Historia
* Economía/Finanzas
* Programación/Tecnología
* Música/Teoría Musical
* Idiomas (Ej: Inglés)
* Artes Visuales/Diseño

**¡Ejemplo de Estilo de Actividad a Seguir!**
\`texto\`: '📊 Carrusel de Instagram: Analiza 5 errores financieros comunes en universitarios. Cada slide debe ser un meme con un dato clave y el título 'No seas ese amigo''.
\`puntos\`: 4

**INICIA LA RESPUESTA DIRECTAMENTE CON EL CARÁCTER DE APERTURA DEL JSON (\`[\`) Y NADA MÁS.**
`;

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

export const promptTemplateBingo1 = "Genera un objeto JSON. El objeto debe contener las siguientes claves (materias): 'ESPANOL', 'MATEMATICAS', 'CIENCIAS', 'SOCIALES', y 'ARTES'. A cada clave asígnale un array que contenga 8 actividades de tarea o estudio relacionadas con esa materia. Las actividades deben ser variadas y adecuadas para un nivel de primaria o secundaria inicial. SOLO proporciona el objeto JSON, sin ninguna explicación ni texto adicional.";

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

export const promptTemplateBingo = `Genera un objeto JSON con actividades educativas para un bingo semanal escolar. 
    
    El formato debe ser:
    {
      "ESPANOL": ["actividad 1", "actividad 2", ...],
      "MATEMATICAS": ["actividad 1", "actividad 2", ...],
      "CIENCIAS": ["actividad 1", "actividad 2", ...],
      "SOCIALES": ["actividad 1", "actividad 2", ...],
      "ARTES": ["actividad 1", "actividad 2", ...]
    }
    
    Genera exactamente 5 actividades diferentes para cada materia. Las actividades deben ser:
    - Apropiadas para estudiantes de secundaria
    - Variadas (lecturas, ejercicios, proyectos, investigaciones)
    - Específicas y claras
    - Realizables en una semana
    
    Responde SOLO con el objeto JSON, sin texto adicional.`;

export const promptTemplateRaspa = `Genera la lista de 5 categorías de misiones educativas (Matemáticas, Lengua, Ciencias Sociales, Ciencias Naturales y Arte) con 3 misiones cada una. El output debe ser únicamente el objeto JSON, garantizando que los campos id de las categorías sean exactamente math, language, social, science, y art. La estructura debe usar: id de categoría (string), name, icon, color, y missions donde el campo id de la misión sea un valor numérico, junto con question, answer (string en minúsculas, sin tildes) y points (número), sin ningún texto, comentario o explicación adicional.`;

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
