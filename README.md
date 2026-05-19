# 🎓 AKAZA — Academic Assignment Portal

> A role-based assignment management and submission portal built for **Agni College of Technology (ACT)**, supporting all engineering departments across every academic year and semester.

## Overview

AKAZA is a full-featured academic portal that bridges the gap between teachers and students for assignment lifecycle management. Teachers can create and manage assignments per subject, view and grade student submissions, and leverage AI to suggest assignment ideas. Students can browse their assignments by semester, submit work directly through the portal, and receive deadline notifications — all within a clean, responsive UI.

---

## ✨ Features

### 👩‍🏫 Teacher

| Feature | Description |
|---|---|
| **Dashboard** | View assignments organized by year, semester, and subject |
| **Create Assignments** | Post assignments with title, description, due date, and total marks |
| **Edit Assignments** | Modify any existing assignment details |
| **View Submissions** | See all student submissions for each assignment |
| **AI Grading** | Get an AI-suggested grade and feedback for any student submission |
| **AI Assignment Ideas** | Generate 3 creative assignment ideas for any subject using Gemini |
| **Notifications** | Get alerted when students submit within the last 24 hours |
| **Search** | Full-text search across assignment titles and descriptions |

### 🎒 Student

| Feature | Description |
|---|---|
| **Dashboard** | View assignments filtered to your department, year, and semester |
| **Submit Assignments** | Upload files directly from the portal |
| **Submission Status** | Track whether your work is Submitted, Graded, or Late |
| **Grades** | See marks awarded once a teacher has graded your submission |
| **Notifications** | Receive reminders for assignments due within 24 hours |
| **Search** | Search assignments by keyword |

### 🔐 Authentication

- Role-based login: **Teacher** or **Student**
- Filtered by **Department** and **Academic Year**
- Session persisted via `localStorage` (survives page refresh)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript 5.8 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS |
| **AI Integration** | Google Gemini 2.5 Flash (`@google/genai`) |
| **State Management** | React Context API (`AuthContext`, `NotificationContext`, `DataContext`) |
| **Storage** | `localStorage` (session persistence) |

---

## 📁 Project Structure

```
├── App.tsx                          # Root component; holds all global contexts and state
├── index.tsx                        # React entry point
├── index.html                       # HTML shell
├── types.ts                         # Shared TypeScript types & enums
├── constants.ts                     # Mock data (users, subjects, assignments, submissions)
├── metadata.json                    # Project metadata
├── package.json
├── vite.config.ts
├── tsconfig.json
│
├── components/
│   ├── Login.tsx                    # Login screen with role/year/department selector
│   ├── Header.tsx                   # Top navigation bar with notifications
│   ├── TeacherDashboard.tsx         # Teacher's main view
│   ├── StudentDashboard.tsx         # Student's main view
│   ├── AssignmentCard.tsx           # Reusable card for each assignment
│   ├── CreateAssignmentModal.tsx    # Modal to create a new assignment (with AI idea generator)
│   ├── EditAssignmentModal.tsx      # Modal to edit an existing assignment
│   ├── SubmitAssignmentModal.tsx    # Modal for students to upload submissions
│   ├── ViewSubmissionsModal.tsx     # Modal for teachers to review & grade submissions
│   ├── NotificationPanel.tsx        # Slide-in notification tray
│   ├── UserProfile.tsx              # User profile page
│   └── icons/                       # SVG icon components
│
└── services/
    └── geminiService.ts             # Google Gemini API integration (ideas + grading)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yoganathmurugan/-Academic-Assignment-Portal.git
cd -Academic-Assignment-Portal

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_API_KEY=your_google_gemini_api_key_here
```

> **Note:** The `API_KEY` environment variable is consumed by `services/geminiService.ts` for the Google Gemini API. Without a valid key, the app gracefully falls back to mock AI responses so the UI remains fully functional for demonstration.

---

## 🧭 Usage

### Logging In

On the login screen, select your:
- **Role** — Teacher or Student
- **Academic Year** — First Year through Final Year
- **Department** — Any of the 6 supported departments
- **Email** — (Optional in demo mode; a matching mock user is selected automatically)

### Demo Credentials (Mock Data)

| Role | Name | Department | Year |
|---|---|---|---|
| Teacher | Dr. Evelyn Reed | AI & Data Science | Third Year |
| Teacher | Prof. Alan Grant | Computer Science | Second Year |
| Student | Alice Johnson | AI & Data Science | Third Year |
| Student | Bob Williams | AI & Data Science | Third Year |
| Student | Charlie Brown | Computer Science | Second Year |

> Any valid combination of role + year + department will work — the app creates a "Demo" user on the fly if no exact mock match exists.

---

## 🏛 Supported Departments

| Code | Full Name |
|---|---|
| CSE | Computer Science and Engineering |
| AIDS | Artificial Intelligence and Data Science |
| ECE | Electrical and Communication Engineering |
| EEE | Electrical and Electronics Engineering |
| MECH | Mechanical Engineering |
| MCT | Mechatronics Engineering |

Subjects are pre-loaded for all 8 semesters across all 6 departments, aligned with Anna University's standard syllabus.

---

## 🤖 AI Features

Powered by **Google Gemini 2.5 Flash** via the `@google/genai` SDK.

### 1. Assignment Idea Generator
- Accessible when creating a new assignment
- Teacher optionally provides a topic; Gemini returns **3 creative, syllabus-aligned assignment ideas**
- Structured output via Gemini's `responseSchema` (JSON mode)

### 2. AI Grading Assistant
- Accessible from the "View Submissions" panel
- Decodes a student's uploaded file (base64 → text), sends it to Gemini with the assignment rubric
- Returns a **suggested integer grade** and **2–3 sentences of constructive feedback**
- Grade is clamped between `0` and `totalMarks`

Both features fall back gracefully to mock responses when the API key is unavailable.

---

## 📐 Data Models

### `User`
```ts
{ id, name, email, role: Role, year: Year, department: Department }
```

### `Assignment`
```ts
{ id, title, description, subjectId, dueDate: ISO string, totalMarks: number }
```

### `Submission`
```ts
{
  id, assignmentId, studentId,
  submittedAt: ISO string,
  file: { name: string, size: number },
  fileContent?: string,      // base64 data URL
  marks?: number,
  status: 'Submitted' | 'Graded' | 'Submitted Late'
}
```

### `Notification`
```ts
{ id, title, message, timestamp: ISO string }
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is private and intended for use by Agni College of Technology.

---

<p align="center">Built with ❤️ for ACT students and faculty</p>
