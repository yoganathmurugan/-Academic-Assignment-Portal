import { User, Role, Subject, Assignment, Submission, SubmissionStatus } from './types';

export enum Year {
  FIRST = 'First Year',
  SECOND = 'Second Year',
  THIRD = 'Third Year',
  FOURTH = 'Final Year',
}

export enum Department {
  CSE = 'Computer Science and Engineering',
  AIDS = 'Artificial Intelligence and Data Science',
  ECE = 'Electrical and Communication Engineering',
  EEE = 'Electrical and Electronics Engineering',
  MECH = 'Mechanical Engineering',
  MCT = 'Mechatronics Engineering',
}

export const YEARS = Object.values(Year);
export const DEPARTMENTS = Object.values(Department);

export const MOCK_USERS: User[] = [
  // AI & DS
  { id: 'T01', name: 'Dr. Evelyn Reed', email: 'teacher@act.edu.in', role: Role.TEACHER, year: Year.THIRD, department: Department.AIDS },
  { id: 'S01', name: 'Alice Johnson', email: 'student@act.edu.in', role: Role.STUDENT, year: Year.THIRD, department: Department.AIDS },
  { id: 'S02', name: 'Bob Williams', email: 'bob@act.edu.in', role: Role.STUDENT, year: Year.THIRD, department: Department.AIDS },
  
  // CSE
  { id: 'T02', name: 'Prof. Alan Grant', email: 'teacher-cse@act.edu.in', role: Role.TEACHER, year: Year.SECOND, department: Department.CSE },
  { id: 'S03', name: 'Charlie Brown', email: 'charlie-cse@act.edu.in', role: Role.STUDENT, year: Year.SECOND, department: Department.CSE },

  // MECH
  { id: 'T03', name: 'Mr. Henry Ford', email: 'teacher-mech@act.edu.in', role: Role.TEACHER, year: Year.FOURTH, department: Department.MECH },
  { id: 'S04', name: 'Diana Prince', email: 'diana-mech@act.edu.in', role: Role.STUDENT, year: Year.FOURTH, department: Department.MECH },
  
  // ECE
  { id: 'T04', name: 'Ms. Ada Lovelace', email: 'teacher-ece@act.edu.in', role: Role.TEACHER, year: Year.THIRD, department: Department.ECE },
  { id: 'S05', name: 'Edward Nygma', email: 'edward-ece@act.edu.in', role: Role.STUDENT, year: Year.THIRD, department: Department.ECE },
  
  // First Year Student (can be any dept)
  { id: 'S06', name: 'Frank Castle', email: 'frank-first@act.edu.in', role: Role.STUDENT, year: Year.FIRST, department: Department.CSE },
  { id: 'T05', name: 'Dr. Marie Curie', email: 'teacher-first@act.edu.in', role: Role.TEACHER, year: Year.FIRST, department: Department.CSE },
];

export const MOCK_SUBJECTS: Subject[] = [
  // --- FIRST YEAR (Common Subjects for all Depts) ---
  { id: 'FY101', name: 'Communicative English', department: Department.CSE, year: Year.FIRST, semester: 1 },
  { id: 'FY102', name: 'Engineering Mathematics - I', department: Department.CSE, year: Year.FIRST, semester: 1 },
  { id: 'FY103', name: 'Engineering Physics', department: Department.CSE, year: Year.FIRST, semester: 1 },
  { id: 'FY104', name: 'Engineering Chemistry', department: Department.CSE, year: Year.FIRST, semester: 1 },
  { id: 'FY105', name: 'Problem Solving and Python Programming', department: Department.CSE, year: Year.FIRST, semester: 1 },
  { id: 'FY201', name: 'Technical English', department: Department.CSE, year: Year.FIRST, semester: 2 },
  { id: 'FY202', name: 'Engineering Mathematics - II', department: Department.CSE, year: Year.FIRST, semester: 2 },
  { id: 'FY203', name: 'Physics for Information Science', department: Department.CSE, year: Year.FIRST, semester: 2 },
  { id: 'FY204', name: 'Basic Electrical and Electronics Engineering', department: Department.CSE, year: Year.FIRST, semester: 2 },
  { id: 'FY205', name: 'Programming in C', department: Department.CSE, year: Year.FIRST, semester: 2 },

  // --- AI & DS ---
  { id: 'AI301', name: 'Data Structures and Algorithms', department: Department.AIDS, year: Year.SECOND, semester: 3 },
  { id: 'AI302', name: 'Probability and Statistics', department: Department.AIDS, year: Year.SECOND, semester: 3 },
  { id: 'AI401', name: 'Foundations of Data Science', department: Department.AIDS, year: Year.SECOND, semester: 4 },
  { id: 'AI402', name: 'Machine Learning Foundations', department: Department.AIDS, year: Year.SECOND, semester: 4 },
  { id: 'AI501', name: 'Deep Learning', department: Department.AIDS, year: Year.THIRD, semester: 5 },
  { id: 'AI502', name: 'Cloud Computing', department: Department.AIDS, year: Year.THIRD, semester: 5 },
  { id: 'AI503', name: 'Distributed Computing', department: Department.AIDS, year: Year.THIRD, semester: 5 },
  { id: 'AI601', name: 'Big Data Analytics', department: Department.AIDS, year: Year.THIRD, semester: 6 },
  { id: 'AI602', name: 'Data Information and Security', department: Department.AIDS, year: Year.THIRD, semester: 6 },
  { id: 'AI603', name: 'Cyber Security', department: Department.AIDS, year: Year.THIRD, semester: 6 },
  { id: 'AI701', name: 'Natural Language Processing', department: Department.AIDS, year: Year.FOURTH, semester: 7 },
  { id: 'AI702', name: 'Reinforcement Learning', department: Department.AIDS, year: Year.FOURTH, semester: 7 },
  { id: 'AI801', name: 'Project Work', department: Department.AIDS, year: Year.FOURTH, semester: 8 },

  // --- CSE ---
  { id: 'CS301', name: 'Data Structures', department: Department.CSE, year: Year.SECOND, semester: 3 },
  { id: 'CS302', name: 'Object Oriented Programming', department: Department.CSE, year: Year.SECOND, semester: 3 },
  { id: 'CS303', name: 'Digital Principles and System Design', department: Department.CSE, year: Year.SECOND, semester: 3 },
  { id: 'CS401', name: 'Operating Systems', department: Department.CSE, year: Year.SECOND, semester: 4 },
  { id: 'CS402', name: 'Database Management Systems', department: Department.CSE, year: Year.SECOND, semester: 4 },
  { id: 'CS403', name: 'Design and Analysis of Algorithms', department: Department.CSE, year: Year.SECOND, semester: 4 },
  { id: 'CS501', name: 'Computer Networks', department: Department.CSE, year: Year.THIRD, semester: 5 },
  { id: 'CS502', name: 'Web Technology', department: Department.CSE, year: Year.THIRD, semester: 5 },
  { id: 'CS601', name: 'Compiler Design', department: Department.CSE, year: Year.THIRD, semester: 6 },
  { id: 'CS602', name: 'Cryptography and Network Security', department: Department.CSE, year: Year.THIRD, semester: 6 },
  { id: 'CS701', name: 'Mobile Computing', department: Department.CSE, year: Year.FOURTH, semester: 7 },
  { id: 'CS801', name: 'Project Work', department: Department.CSE, year: Year.FOURTH, semester: 8 },

  // --- ECE ---
  { id: 'EC301', name: 'Signals and Systems', department: Department.ECE, year: Year.SECOND, semester: 3 },
  { id: 'EC302', name: 'Analog Electronics', department: Department.ECE, year: Year.SECOND, semester: 3 },
  { id: 'EC401', name: 'Electromagnetic Fields', department: Department.ECE, year: Year.SECOND, semester: 4 },
  { id: 'EC402', name: 'Linear Integrated Circuits', department: Department.ECE, year: Year.SECOND, semester: 4 },
  { id: 'EC501', name: 'Digital Signal Processing', department: Department.ECE, year: Year.THIRD, semester: 5 },
  { id: 'EC502', name: 'Communication Networks', department: Department.ECE, year: Year.THIRD, semester: 5 },
  { id: 'EC601', name: 'VLSI Design', department: Department.ECE, year: Year.THIRD, semester: 6 },
  { id: 'EC602', name: 'Microprocessors and Microcontrollers', department: Department.ECE, year: Year.THIRD, semester: 6 },
  { id: 'EC701', name: 'Embedded Systems', department: Department.ECE, year: Year.FOURTH, semester: 7 },
  { id: 'EC801', name: 'Project Work', department: Department.ECE, year: Year.FOURTH, semester: 8 },

  // --- EEE ---
  { id: 'EE301', name: 'Electrical Machines - I', department: Department.EEE, year: Year.SECOND, semester: 3 },
  { id: 'EE302', name: 'Analog Electronics', department: Department.EEE, year: Year.SECOND, semester: 3 },
  { id: 'EE401', name: 'Power Systems - I', department: Department.EEE, year: Year.SECOND, semester: 4 },
  { id: 'EE402', name: 'Digital Logic Circuits', department: Department.EEE, year: Year.SECOND, semester: 4 },
  { id: 'EE501', name: 'Control Systems', department: Department.EEE, year: Year.THIRD, semester: 5 },
  { id: 'EE502', name: 'Power Electronics', department: Department.EEE, year: Year.THIRD, semester: 5 },
  { id: 'EE601', name: 'Power System Analysis', department: Department.EEE, year: Year.THIRD, semester: 6 },
  { id: 'EE701', name: 'High Voltage Engineering', department: Department.EEE, year: Year.FOURTH, semester: 7 },
  { id: 'EE801', name: 'Project Work', department: Department.EEE, year: Year.FOURTH, semester: 8 },

  // --- MECH ---
  { id: 'ME301', name: 'Thermodynamics', department: Department.MECH, year: Year.SECOND, semester: 3 },
  { id: 'ME302', name: 'Fluid Mechanics', department: Department.MECH, year: Year.SECOND, semester: 3 },
  { id: 'ME401', name: 'Kinematics of Machinery', department: Department.MECH, year: Year.SECOND, semester: 4 },
  { id: 'ME402', name: 'Manufacturing Technology', department: Department.MECH, year: Year.SECOND, semester: 4 },
  { id: 'ME501', name: 'Heat and Mass Transfer', department: Department.MECH, year: Year.THIRD, semester: 5 },
  { id: 'ME502', name: 'Design of Machine Elements', department: Department.MECH, year: Year.THIRD, semester: 5 },
  { id: 'ME601', name: 'Gas Dynamics and Jet Propulsion', department: Department.MECH, year: Year.THIRD, semester: 6 },
  { id: 'ME701', name: 'Finite Element Analysis', department: Department.MECH, year: Year.FOURTH, semester: 7 },
  { id: 'ME702', name: 'Mechatronics', department: Department.MECH, year: Year.FOURTH, semester: 7 },
  { id: 'ME801', name: 'Automobile Engineering', department: Department.MECH, year: Year.FOURTH, semester: 8 },
  { id: 'ME802', name: 'Project Work', department: Department.MECH, year: Year.FOURTH, semester: 8 },

  // --- MCT ---
  { id: 'MT301', name: 'Strength of Materials', department: Department.MCT, year: Year.SECOND, semester: 3 },
  { id: 'MT401', name: 'Control System Engineering', department: Department.MCT, year: Year.SECOND, semester: 4 },
  { id: 'MT501', name: 'Sensors and Instrumentation', department: Department.MCT, year: Year.THIRD, semester: 5 },
  { id: 'MT601', name: 'Robotics and Automation', department: Department.MCT, year: Year.THIRD, semester: 6 },
  { id: 'MT701', name: 'Industrial Automation', department: Department.MCT, year: Year.FOURTH, semester: 7 },
  { id: 'MT801', name: 'Project Work', department: Department.MCT, year: Year.FOURTH, semester: 8 },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);


export const MOCK_ASSIGNMENTS: Assignment[] = [
  // AI & DS Assignments
  { id: 'A001', title: 'Assignment 1: Neural Networks', description: 'Build and train a simple neural network for image classification.', subjectId: 'AI501', dueDate: tomorrow.toISOString(), totalMarks: 10 },
  { id: 'A002', title: 'Assignment 2: CNN Architectures', description: 'Compare the performance of two different CNN architectures.', subjectId: 'AI501', dueDate: nextWeek.toISOString(), totalMarks: 15 },
  { id: 'A003', title: 'Assignment 1: VM Provisioning', description: 'Write a script to programmatically provision a virtual machine on a cloud platform.', subjectId: 'AI502', dueDate: nextWeek.toISOString(), totalMarks: 10 },
  { id: 'A004', title: 'Assignment 1: Big Data Processing', description: 'Use a framework like Spark or Hadoop to process a large dataset.', subjectId: 'AI601', dueDate: lastWeek.toISOString(), totalMarks: 20 },
  { id: 'A009', title: 'Sentiment Analysis Project', description: 'Perform sentiment analysis on a dataset of movie reviews using NLP techniques.', subjectId: 'AI701', dueDate: nextWeek.toISOString(), totalMarks: 25 },
  
  // CSE Assignments
  { id: 'A005', title: 'Lab 1: Linked Lists', description: 'Implement a doubly linked list with insert, delete, and search operations.', subjectId: 'CS301', dueDate: nextWeek.toISOString(), totalMarks: 10 },
  { id: 'A006', title: 'Mini Project: SQL Queries', description: 'Design a schema and write complex SQL queries for a sample retail database.', subjectId: 'CS402', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), totalMarks: 25 },
  { id: 'A010', title: 'Client-Server Socket Programming', description: 'Create a simple chat application using TCP sockets in Java or Python.', subjectId: 'CS501', dueDate: tomorrow.toISOString(), totalMarks: 15 },
  
  // MECH Assignments
  { id: 'A007', title: 'FEA Simulation', description: 'Perform a stress analysis on a given mechanical bracket using ANSYS or a similar tool.', subjectId: 'ME701', dueDate: tomorrow.toISOString(), totalMarks: 15 },
  { id: 'A011', title: 'Thermodynamic Cycle Analysis', description: 'Analyze the efficiency of a Rankine cycle with given parameters.', subjectId: 'ME301', dueDate: nextWeek.toISOString(), totalMarks: 10 },

  // ECE Assignments
  { id: 'A012', title: 'VHDL Coding for a Full Adder', description: 'Write and simulate VHDL code for a 4-bit full adder.', subjectId: 'EC601', dueDate: nextWeek.toISOString(), totalMarks: 10 },

  // First Year Assignments
  { id: 'A008', title: 'C Programming Task 1', description: 'Write a C program to manage student records using structures and file I/O.', subjectId: 'FY205', dueDate: nextWeek.toISOString(), totalMarks: 10 },
];

const MOCK_FILE_CONTENT = 'data:text/plain;base64,VGhpcyBpcyBhIG1vY2sgc3VibWlzc2lvbiBmaWxlLiBDb250ZW50cyBhcmUganVzdCBmb3IgZGVtb25zdHJhdGlvbi4='; // "This is a mock submission file. Contents are just for demonstration."

export const MOCK_SUBMISSIONS: Submission[] = [
    { id: 'SUB01', assignmentId: 'A004', studentId: 'S02', submittedAt: yesterday.toISOString(), file: { name: 'big_data_report.pdf', size: 120450 }, fileContent: MOCK_FILE_CONTENT, status: SubmissionStatus.LATE, marks: 7 },
    { id: 'SUB02', assignmentId: 'A004', studentId: 'S01', submittedAt: new Date(lastWeek.getTime() - 86400000).toISOString(), file: { name: 'A004_S01_submission.zip', size: 5420330 }, fileContent: MOCK_FILE_CONTENT, status: SubmissionStatus.GRADED, marks: 18 },
    { id: 'SUB03', assignmentId: 'A005', studentId: 'S03', submittedAt: new Date().toISOString(), file: { name: 'linked_list_code.c', size: 4800 }, fileContent: MOCK_FILE_CONTENT, status: SubmissionStatus.SUBMITTED },
];