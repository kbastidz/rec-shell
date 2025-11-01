
interface Question {
  q: string;
  a: string[];
  correct: number;
  difficulty: number;
  explanation: string;
}

interface SubjectData {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  questions: Question[];
}

interface CurrentQuestion extends Question {
  subject: string;
  subjectData: SubjectData;
}

type SubjectsType = {
  [key: string]: SubjectData;
}


interface Evidencia {
  texto?: string;
  archivo?: File | null;
}

type MateriaKey = 'ESPANOL' | 'MATEMATICAS' | 'CIENCIAS' | 'SOCIALES' | 'ARTES';

interface Casilla {
  id: number;
  materia: MateriaKey;
  accion: string;
  completada: boolean;
  evidencia: Evidencia | null;
}

interface Linea {
  tipo: 'fila' | 'columna' | 'diagonal';
  index: number;
  casillas: number[];
}

interface Notificacion {
  mensaje: string;
  color: string;
}

interface Actividad {
  texto: string;
  puntos: number;
}

interface Materia {
  id: number;
  nombre: string;
  emoji: string;
  color: string;
  actividades: Actividad[];
}

interface ResultadoType {
  materia: Materia;
  actividad: Actividad;
}

//
interface AccionesGeneradas {
  [key: string]: string[];
}

//rasp

interface Mission {
  id: number;
  question: string;
  answer: string;
  points: number;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  missions: Mission[];
}

interface RewardType {
  type: string;
  name: string;
  emoji: string;
  probability: number;
  minPoints: number;
  maxPoints: number;
  color: string;
}

interface Reward {
  rarity: RewardType;
  points: number;
  badge: string | null;
  subjectId: string;
}

interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

interface UnlockedCard extends Reward {
  timestamp: number;
}

