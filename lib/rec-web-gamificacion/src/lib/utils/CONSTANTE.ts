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