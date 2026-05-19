import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Year, YEARS } from '../constants';
import { Assignment, Subject, Submission } from '../types';
import AssignmentCard from './AssignmentCard';
import CreateAssignmentModal from './CreateAssignmentModal';
import { PlusIcon } from './icons/PlusIcon';
import { AuthContext, DataContext } from '../App';
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

const TeacherDashboard: React.FC = () => {
  const auth = useContext(AuthContext);
  const data = useContext(DataContext);
  
  const [selectedYear, setSelectedYear] = useState<Year>(auth?.user?.year || Year.FIRST);
  const availableSemesters = useMemo(() => getSemestersForYear(selectedYear), [selectedYear]);
  const [selectedSemester, setSelectedSemester] = useState<number>(availableSemesters[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubjectForModal, setActiveSubjectForModal] = useState<Subject | null>(null);

  useEffect(() => {
    const semesters = getSemestersForYear(selectedYear);
    setSelectedSemester(semesters[0] || 1);
  }, [selectedYear]);

  const openCreateModal = (subject: Subject) => {
    setActiveSubjectForModal(subject);
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setActiveSubjectForModal(null);
    setIsModalOpen(false);
  };

  const { filteredSubjects, filteredAssignments } = useMemo(() => {
    if (!auth?.user || !data) return { filteredSubjects: [], filteredAssignments: [] };
    
    const subs = data.subjects.filter(s => s.department === auth.user.department && s.year === selectedYear && s.semester === selectedSemester);
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
  }, [selectedYear, selectedSemester, searchQuery, data, auth?.user]);


  if (!auth?.user || !data) return null;

  const { submissions, createAssignment, updateAssignment, gradeSubmissions } = data;

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-act-blue mb-2">Teacher Dashboard</h2>
      <p className="text-gray-600 mb-6">{auth.user.department}</p>
      
      <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Academic Year</label>
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Years">
                {YEARS.map(year => (
                    <button
                        key={year}
                        onClick={() => setSelectedYear(year as Year)}
                        className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            selectedYear === year
                            ? 'border-act-red text-act-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {year}
                    </button>
                ))}
            </nav>
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center border-b border-gray-300">
        <nav className="-mb-px flex space-x-6" aria-label="Semesters">
            {availableSemesters.map(sem => (
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
        <div className="relative w-full max-w-xs">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-act-blue focus:border-act-blue"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
        </div>
      </div>

      {filteredSubjects.length > 0 ? filteredSubjects.map(subject => (
         <section key={subject.id} className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">{subject.name}</h3>
                <button
                onClick={() => openCreateModal(subject)}
                className="flex items-center gap-2 px-4 py-2 bg-act-blue text-white rounded-lg shadow hover:bg-blue-800 transition-colors"
                >
                <PlusIcon />
                Create Assignment
                </button>
            </div>

            {filteredAssignments.filter(a => a.subjectId === subject.id).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAssignments.filter(a => a.subjectId === subject.id).map(assignment => (
                    <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    subject={subject}
                    submissions={submissions.filter(sub => sub.assignmentId === assignment.id)}
                    onUpdate={updateAssignment}
                    onGrade={gradeSubmissions}
                    />
                ))}
                </div>
            ) : (
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
                    <h4 className="text-md font-medium text-gray-700">No assignments found for this subject.</h4>
                    <p className="text-gray-500 mt-1 text-sm">{searchQuery ? 'Try adjusting your search query.' : 'Click "Create Assignment" to get started.'}</p>
                </div>
            )}
         </section>
      )) : (
         <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-800">No subjects found for this semester.</h4>
          <p className="text-gray-500 mt-2">Select another year or semester to view subjects.</p>
        </div>
      )}

      {isModalOpen && activeSubjectForModal && (
          <CreateAssignmentModal
          subject={activeSubjectForModal}
          onClose={closeCreateModal}
          onCreate={createAssignment}
          />
      )}

    </div>
  );
};

export default TeacherDashboard;