
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

export interface CurrentQuestion extends Question {
  subject: string;
  subjectData: SubjectData;
}

export type SubjectsType = {
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

export interface Materia {
  id: number;
  nombre: string;
  emoji: string;
  color: string;
  actividades: Actividad[];
}

export interface ResultadoType {
  materia: Materia;
  actividad: Actividad;
}

//
interface AccionesGeneradas {
  [key: string]: string[];
}

//rasp

export interface Mission {
  id: number;
  question: string;
  answer: string;
  points: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  missions: Mission[];
}

export interface RewardType {
  type: string;
  name: string;
  emoji: string;
  probability: number;
  minPoints: number;
  maxPoints: number;
  color: string;
}

export interface Reward {
  rarity: RewardType;
  points: number;
  badge: string | null;
  subjectId: string;
}

export interface NotificationType {
  type: 'success' | 'error';
  message: string;
}

export interface UnlockedCard extends Reward {
  timestamp: number;
}

