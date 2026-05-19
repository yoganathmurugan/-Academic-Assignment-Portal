import React, { useState, useContext, useMemo } from 'react';
import { AuthContext, DataContext } from '../App';
import { Assignment, Subject, Submission } from '../types';
import AssignmentCard from './AssignmentCard';
import { SearchIcon } from './icons/SearchIcon';

const getSemestersForYear = (year: string): number[] => {
    switch(year) {
        case 'First Year': return [1, 2];
        case 'Second Year': return [3, 4];
        case 'Third Year': return [5, 6];
        case 'Final Year': return [7, 8];
        default: return [];
    }
}

const StudentDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const data = useContext(DataContext);
  
  const studentSemesters = useMemo(() => auth?.user?.year ? getSemestersForYear(auth.user.year) : [], [auth?.user?.year]);
  const [selectedSemester, setSelectedSemester] = useState<number>(studentSemesters[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const { filteredSubjects, filteredAssignments } = useMemo(() => {
    if (!auth?.user || !data) return { filteredSubjects: [], filteredAssignments: [] };
    
    const subs = data.subjects.filter(s => s.department === auth.user.department && s.year === auth.user.year && s.semester === selectedSemester);
    const subIds = subs.map(s => s.id);
    let assigns = data.assignments.filter(a => subIds.includes(a.subjectId));

    if (searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase();
        assigns = assigns.filter(a =>
            a.title.toLowerCase().includes(lowercasedQuery) ||
            a.description.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    return { filteredSubjects: subs, filteredAssignments: assigns };
  }, [selectedSemester, searchQuery, data, auth?.user]);

  if (!auth?.user || !data) return null;

  const { submissions, addSubmission } = data;

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-act-blue mb-2">Student Dashboard</h2>
      <p className="text-gray-600 mb-6">{auth.user.department} - {auth.user.year}</p>

      <div className="mb-6 border-b border-gray-300">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {studentSemesters.map(sem => (
                <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        selectedSemester === sem
                        ? 'border-act-red text-act-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    Semester {sem}
                </button>
            ))}
        </nav>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Your Assignments for Semester {selectedSemester}</h3>
        <div className="relative w-full max-w-sm">
             <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your assignments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-act-blue focus:border-act-blue"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
        </div>
      </div>


      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssignments.map(assignment => {
            const studentSubmission = submissions.find(
              s => s.assignmentId === assignment.id && s.studentId === auth?.user?.id
            );
            return (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                subject={filteredSubjects.find(s => s.id === assignment.subjectId)}
                studentSubmission={studentSubmission}
                onNewSubmission={addSubmission}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-800">No assignments found.</h4>
          <p className="text-gray-500 mt-2">{searchQuery ? 'Try a different search term.' : 'Check back later for new assignments.'}</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;