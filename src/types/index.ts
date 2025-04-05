
export interface Person {
  id: number;
  name: string;
  instrument: string;
  availability: string;
  bio: string;
  imageUrl: string;
}

export interface Match {
  mentor: Person;
  student: Person;
}

export interface Review {
  name: string;
  text: string;
}

export interface Mentor extends Person {
  starRating: number;
  resumeLink: string;
  reviews: Review[];
  instruments?: Instrument[];
  availabilitySlots?: TimeSlot[];
  approved?: boolean;
  pending?: boolean;
}

export interface Student extends Person {
  email: string;
  availabilitySlots?: TimeSlot[];
}

export type Instrument = "Violin" | "Guitar" | "Piano" | "Drums" | "Flute";

export interface TimeSlot {
  day: Day;
  startTime: string;
  endTime: string;
}

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Session {
  id: number;
  mentorId: number;
  studentId: number;
  instrument: Instrument;
  date: Date | string;
  startTime: string;
  endTime: string;
  zoomLink?: string;
}

// New types for the project recording system
export interface Project {
  id: number;
  title: string;
  studentId: number;
  mentorId?: number;
  instrument: Instrument;
  sheetMusicUrl: string;
  tempo: number;
  status: ProjectStatus;
  createdAt: Date;
  takes: ProjectTake[];
  reflection?: string;
}

export type ProjectStatus = "Not Started" | "In Progress" | "Needs Work" | "Mastered";

export interface ProjectTake {
  id: number;
  projectId: number;
  recordedAt: Date;
  videoUrl: string;
  feedback?: Feedback[];
}

export interface Feedback {
  id: number;
  takeId: number;
  mentorId: number;
  measureNumber?: number;
  timestamp?: number;
  comment: string;
  resolved: boolean;
}

// Predefined songs to practice
export interface PracticeSong {
  id: number;
  title: string;
  composer: string;
  instrument: Instrument;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sheetMusicUrl: string;
  tempo: number;
}
