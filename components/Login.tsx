import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { Role } from '../types';
import { YEARS, DEPARTMENTS, Year, Department } from '../constants';

type LoginStep = 'credentials' | 'year' | 'department';
type CredentialView = 'login' | 'forgot_password' | 'forgot_password_confirmation';

const Login: React.FC = () => {
  const [step, setStep] = useState<LoginStep>('credentials');
  const [credentialView, setCredentialView] = useState<CredentialView>('login');
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [activeRole, setActiveRole] = useState<Role>(Role.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSentTo, setResetEmailSentTo] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here.
    // For the demo, we just move to the next step.
    setStep('year');
  };

  const handleYearSelect = (year: Year) => {
    setSelectedYear(year);
    setStep('department');
  };
  
  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
    // This is the final step, now we can log the user in with all the collected info.
    if (selectedYear) {
      auth?.login(selectedYear, dept, email, activeRole);
    }
  };

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setEmail(role === Role.STUDENT ? 'student@act.edu.in' : 'teacher@act.edu.in');
  };
  
  const resetSelection = (targetStep: LoginStep) => {
    setStep(targetStep);
    setCredentialView('login');
    if (targetStep === 'credentials') {
        setSelectedYear(null);
        setSelectedDept(null);
    }
  }

  const stepIndicator = (
    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
        <span className={`${step === 'credentials' ? 'text-act-blue font-semibold' : ''}`}>Login</span>
        <span className="text-gray-300">›</span>
        <span className={`${step === 'year' ? 'text-act-blue font-semibold' : ''}`}>Year</span>
        <span className="text-gray-300">›</span>
        <span className={`${step === 'department' ? 'text-act-blue font-semibold' : ''}`}>Department</span>
    </div>
  )

  const renderForgotPasswordView = () => (
    <div>
        <h3 className="text-xl font-bold text-act-blue text-center mb-4">Reset Password</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Enter your email to receive a password reset link.</p>
        <form onSubmit={(e) => { e.preventDefault(); setResetEmailSentTo(resetEmail); setCredentialView('forgot_password_confirmation'); }} className="space-y-6">
            <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="reset-email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="you@act.edu.in" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
            </div>
            <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-act-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Send Reset Link
                </button>
            </div>
        </form>
        <div className="mt-4 text-center">
            <button onClick={() => setCredentialView('login')} className="text-sm font-semibold text-act-blue hover:underline">
                &larr; Back to Login
            </button>
        </div>
    </div>
  );

  const renderForgotPasswordConfirmationView = () => (
    <div>
        <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-act-blue text-center mt-4 mb-2">Check Your Email</h3>
        <p className="text-center text-sm text-gray-600 mb-6">
            A password reset link has been sent to <br/>
            <span className="font-semibold text-gray-800">{resetEmailSentTo}</span>.
        </p>
        <button onClick={() => setCredentialView('login')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-act-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Back to Login
        </button>
    </div>
  );

  const renderLoginView = () => (
    <div>
        <div className="flex border-b mb-6">
            <button onClick={() => handleRoleChange(Role.STUDENT)} className={`w-1/2 py-3 font-semibold ${activeRole === Role.STUDENT ? 'border-b-2 border-act-red text-act-red' : 'text-gray-500'}`}>Student</button>
            <button onClick={() => handleRoleChange(Role.TEACHER)} className={`w-1/2 py-3 font-semibold ${activeRole === Role.TEACHER ? 'border-b-2 border-act-red text-act-red' : 'text-gray-500'}`}>Teacher</button>
        </div>
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email / ID</label>
                <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., username@act.edu.in" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
            </div>
            <div>
                <div className="flex justify-between items-baseline">
                    <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
                    <button type="button" onClick={() => setCredentialView('forgot_password')} className="text-sm font-medium text-act-blue hover:underline focus:outline-none">Forgot Password?</button>
                </div>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
                <p className="mt-1 text-xs text-gray-500">Hint: Use any password for the demo.</p>
            </div>
            <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-act-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Continue</button>
            </div>
        </form>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'credentials':
        switch (credentialView) {
            case 'login': return renderLoginView();
            case 'forgot_password': return renderForgotPasswordView();
            case 'forgot_password_confirmation': return renderForgotPasswordConfirmationView();
        }
      case 'year':
        return (
          <div>
            <h2 className="text-2xl font-bold text-act-blue text-center mb-2">Select Your Year</h2>
            <p className="text-center text-gray-500 mb-6">Please confirm your academic year.</p>
            <div className="space-y-3">
              {YEARS.map(year => (
                <button key={year} onClick={() => handleYearSelect(year)} className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:border-act-blue hover:text-act-blue transition-colors group">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">{year}</span>
                </button>
              ))}
            </div>
             <button onClick={() => resetSelection('credentials')} className="mt-4 text-sm text-gray-600 hover:underline">‹ Back to Login</button>
          </div>
        );
      case 'department':
        return (
          <div>
            <h2 className="text-2xl font-bold text-act-blue text-center mb-2">Select Your Department</h2>
            <p className="text-center text-gray-500 mb-6">You're in <span className="font-semibold">{selectedYear}</span>. Now, which department?</p>
            <div className="space-y-3">
              {DEPARTMENTS.map(dept => (
                <button key={dept} onClick={() => handleDeptSelect(dept)} className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:border-act-blue hover:text-act-blue transition-colors group">
                  <span className="group-hover:translate-x-1 transition-transform inline-block">{dept}</span>
                </button>
              ))}
            </div>
             <button onClick={() => resetSelection('year')} className="mt-4 text-sm text-gray-600 hover:underline">‹ Back to Year Selection</button>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto lg:grid lg:grid-cols-2 shadow-2xl rounded-xl overflow-hidden">
        <div className="relative hidden lg:block">
            <img src="https://i.postimg.cc/k4xG1D42/act-campus.jpg" alt="Agni College of Technology Campus" className="absolute h-full w-full object-cover" />
            <div className="absolute inset-0 bg-act-blue opacity-80"></div>
            <div className="relative p-12 text-white flex flex-col justify-between h-full">
                <div>
                    <img src="https://act.edu.in/wp-content/uploads/2022/12/Agni-College-of-Technology-Logo-1.png" alt="ACT Logo" className="w-20" />
                    <h1 className="text-3xl font-bold mt-4">ACT Assignment Portal</h1>
                    <p className="mt-2 opacity-80">Your gateway to academic submissions and tracking.</p>
                </div>
                 <p className="text-sm opacity-60">&copy; {new Date().getFullYear()} Agni College of Technology. All rights reserved.</p>
            </div>
        </div>

        <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
            <div className="lg:hidden text-center mb-6">
                 <img src="https://act.edu.in/wp-content/uploads/2022/12/Agni-College-of-Technology-Logo-1.png" alt="ACT Logo" className="w-16 mx-auto mb-2" />
                 <h1 className="text-2xl font-bold text-act-blue">Assignment Portal</h1>
            </div>
            {credentialView === 'login' && stepIndicator}
            <div className="transition-all">
                {renderStepContent()}
            </div>
        </div>
    </div>
  );
};

export default Login;