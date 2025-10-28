
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