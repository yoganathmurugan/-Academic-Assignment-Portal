import { Department, Year } from "./constants";

export enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  year: Year;
  department: Department;
}

export interface Subject {
  id: string;
  name: string;
  department: Department;
  year: Year;
  semester: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string; // ISO string
  totalMarks: number;
}

export enum SubmissionStatus {
    SUBMITTED = 'Submitted',
    GRADED = 'Graded',
    LATE = 'Submitted Late',
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string; // ISO string
  file: {
    name:string;
    size: number;
  };
  fileContent?: string; // Base64 encoded file content
  marks?: number;
  status: SubmissionStatus;
}

export interface Notification {
    id:string;
    title: string;
    message: string;
    timestamp: string;
}