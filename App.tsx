import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Header from './components/Header';
import { User, Role, Notification, Assignment, Subject, Submission } from './types';
import { MOCK_USERS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_SUBJECTS, Year, Department } from './constants';
import UserProfile from './components/UserProfile';

// Auth Context
export const AuthContext = React.createContext<{
  user: User | null;
  login: (year: Year, department: Department, email: string, role: Role) => void;
  logout: () => void;
} | null>(null);

// Notification Context
export const NotificationContext = React.createContext<{
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
} | null>(null);

// Data Context
export const DataContext = React.createContext<{
  assignments: Assignment[];
  subjects: Subject[];
  submissions: Submission[];
  createAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (assignment: Assignment) => void;
  gradeSubmissions: (submissions: Submission[]) => void;
  addSubmission: (submission: Submission) => void;
} | null>(null);


type View = 'dashboard' | 'profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Lifted state for shared data
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [subjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);

  const login = useCallback((year: Year, department: Department, email: string, role: Role) => {
    // Find a user that matches the criteria, ignoring email for flexibility in the demo.
    let userToLogin = MOCK_USERS.find(
      (u) => u.role === role && u.year === year && u.department === department
    );

    // If no specific user is found for the selected combination (which can happen with sparse mock data),
    // create a generic one on the fly to ensure the demo is smooth and never fails to log in.
    if (!userToLogin) {
      const genericName = role === Role.STUDENT ? 'Demo Student' : 'Demo Teacher';
      userToLogin = {
        id: `${role.charAt(0).toUpperCase()}${Date.now()}`,
        name: genericName,
        email: email || `${role}@act.edu.in`,
        role: role,
        year: year,
        department: department
      };
    }
    
    setUser(userToLogin);
    localStorage.setItem('user', JSON.stringify(userToLogin));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setNotifications([]);
    setCurrentView('dashboard');
    localStorage.removeItem('user');
  }, []);

  // Check for logged in user in local storage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Generate notifications when user logs in
  useEffect(() => {
    if (!user) return;
    
    const newNotifications: Notification[] = [];
    const now = new Date();
    
    if (user.role === Role.STUDENT) {
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const studentSubs = submissions.filter(s => s.studentId === user.id).map(s => s.assignmentId);
      const studentAssignments = assignments;

      studentAssignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        if (dueDate > now && dueDate <= twentyFourHoursFromNow && !studentSubs.includes(assignment.id)) {
          newNotifications.push({
            id: `notif-due-${assignment.id}`,
            title: 'Deadline Reminder',
            message: `Your assignment "${assignment.title}" is due soon.`,
            timestamp: new Date().toISOString(),
          });
        }
      });
    } else if (user.role === Role.TEACHER) {
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        submissions.forEach(submission => {
            const submittedAt = new Date(submission.submittedAt);
            if (submittedAt > twentyFourHoursAgo) {
                const student = MOCK_USERS.find(u => u.id === submission.studentId);
                const assignment = assignments.find(a => a.id === submission.assignmentId);
                newNotifications.push({
                    id: `notif-sub-${submission.id}`,
                    title: 'New Submission',
                    message: `${student?.name || 'A student'} submitted to "${assignment?.title || 'assignment'}".`,
                    timestamp: submission.submittedAt,
                });
            }
        });
    }

    setNotifications(newNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, [user, assignments, submissions]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Data mutation handlers
  const createAssignment = useCallback((newAssignment: Omit<Assignment, 'id'>) => {
    const createdAssignment: Assignment = {
      ...newAssignment,
      id: `A${Date.now()}`,
    };
    setAssignments(prev => [...prev, createdAssignment]);
  }, []);
  
  const updateAssignment = useCallback((updatedAssignment: Assignment) => {
    setAssignments(prev => 
      prev.map(a => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  }, []);
  
  const gradeSubmissions = useCallback((updatedSubmissions: Submission[]) => {
    setSubmissions(prev => {
        const updatedIds = new Set(updatedSubmissions.map(s => s.id));
        const untouched = prev.filter(s => !updatedIds.has(s.id));
        return [...untouched, ...updatedSubmissions];
    });
  }, []);

  const addSubmission = useCallback((submission: Submission) => {
    setSubmissions(prev => [
        ...prev.filter(s => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId)), 
        submission
    ]);
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  const notificationContextValue = useMemo(() => ({ notifications, dismissNotification, clearNotifications }), [notifications]);
  const dataContextValue = useMemo(() => ({
    assignments, subjects, submissions, createAssignment, updateAssignment, gradeSubmissions, addSubmission
  }), [assignments, subjects, submissions, createAssignment, updateAssignment, gradeSubmissions, addSubmission]);


  const renderContent = () => {
    if (!user) return <Login />;

    if (currentView === 'profile') {
        return <UserProfile onBack={() => setCurrentView('dashboard')} />;
    }

    switch (user.role) {
      case Role.TEACHER:
        return <TeacherDashboard />;
      case Role.STUDENT:
        return <StudentDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <NotificationContext.Provider value={notificationContextValue}>
        <DataContext.Provider value={dataContextValue}>
          <div className="min-h-screen bg-transparent font-sans">
            { user && (
              <div className="sticky top-0 z-40">
                <Header onNavigateToProfile={() => setCurrentView('profile')} />
              </div>
            )}
            <main className={!user ? "min-h-screen flex items-center justify-center bg-gray-100 p-4" : "p-4 sm:p-6 md:p-8"}>
              {renderContent()}
            </main>
          </div>
        </DataContext.Provider>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;