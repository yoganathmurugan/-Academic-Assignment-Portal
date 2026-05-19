import React, { useState, useMemo, useContext } from 'react';
import { Assignment, Subject, Submission, Role, SubmissionStatus } from '../types';
import { AuthContext } from '../App';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { EyeIcon } from './icons/EyeIcon';
import { UploadIcon } from './icons/UploadIcon';
import ViewSubmissionsModal from './ViewSubmissionsModal';
import SubmitAssignmentModal from './SubmitAssignmentModal';
import EditAssignmentModal from './EditAssignmentModal';
import { PencilIcon } from './icons/PencilIcon';

interface AssignmentCardProps {
  assignment: Assignment;
  subject?: Subject;
  submissions?: Submission[]; // For teacher view
  studentSubmission?: Submission; // For student view
  onNewSubmission?: (submission: Submission) => void;
  onUpdate?: (assignment: Assignment) => void;
  onGrade?: (submissions: Submission[]) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, subject, submissions = [], studentSubmission, onNewSubmission, onUpdate, onGrade }) => {
  const auth = useContext(AuthContext);
  const [isViewSubmissionsModalOpen, setViewSubmissionsModalOpen] = useState(false);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  const dueDate = useMemo(() => new Date(assignment.dueDate), [assignment.dueDate]);
  const now = useMemo(() => new Date(), []);
  
  const isSubmitted = !!studentSubmission;

  const isOverdue = useMemo(() => dueDate < now && !isSubmitted, [dueDate, now, isSubmitted]);
  const isDueSoon = useMemo(() => {
    if (isSubmitted || isOverdue) return false;
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDue > 0 && hoursUntilDue <= 24;
  }, [dueDate, now, isSubmitted, isOverdue]);

  const getStatusInfo = () => {
    if (studentSubmission) {
      switch (studentSubmission.status) {
        case SubmissionStatus.GRADED:
          return { color: 'blue', text: 'Graded' };
        case SubmissionStatus.LATE:
          return { color: 'yellow', text: 'Submitted Late' };
        case SubmissionStatus.SUBMITTED:
          return { color: 'green', text: 'Submitted' };
      }
    }
    if (isOverdue) return { color: 'red', text: 'Overdue' };
    if (isDueSoon) return { color: 'yellow', text: 'Due Soon' };
    return { color: 'gray', text: '' };
  };

  const {color: statusColor, text: statusText} = getStatusInfo();
  
  const dateColor = isSubmitted
    ? studentSubmission.status === SubmissionStatus.GRADED ? 'text-gray-600'
    : studentSubmission.status === SubmissionStatus.LATE ? 'text-yellow-600'
    : 'text-green-600'
    : isOverdue
    ? 'text-red-600'
    : isDueSoon
    ? 'text-yellow-600'
    : 'text-gray-600';

  const borderColor = statusColor === 'gray' ? 'border-transparent' : `border-${statusColor}-500`;
  
  const formattedDate = dueDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const renderTeacherActions = () => (
    <>
      <div className="text-sm font-medium text-gray-600">
        Submissions: <span className="font-bold text-act-blue">{submissions.length}</span>
      </div>
       <div className="flex items-center space-x-2">
        <button
          onClick={() => setEditModalOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          aria-label="Edit Assignment"
        >
          <PencilIcon />
        </button>
        <button
          onClick={() => setViewSubmissionsModalOpen(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-act-blue text-white rounded-md font-semibold hover:bg-blue-800"
        >
          <EyeIcon /> View
        </button>
      </div>
    </>
  );

  const renderStudentActions = () => {
    const statusStyles: { [key: string]: string } = {
        [SubmissionStatus.GRADED]: 'text-blue-800 bg-blue-100',
        [SubmissionStatus.LATE]: 'text-yellow-800 bg-yellow-100',
        [SubmissionStatus.SUBMITTED]: 'text-green-800 bg-green-100',
        'Overdue': 'text-red-800 bg-red-100',
        'Due Soon': 'text-yellow-800 bg-yellow-100',
    };
    
    if (statusText && statusStyles[statusText as keyof typeof statusStyles]) {
        return <div className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[statusText as keyof typeof statusStyles]}`}>{statusText}</div>;
    }

    return (
      <button
        onClick={() => setSubmitModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-act-red text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
      >
        <UploadIcon /> Submit
      </button>
    );
  };
  
  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 border-l-4 ${borderColor}`}>
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-act-blue mb-1">
                <BookOpenIcon />
                <span className="font-semibold">{subject?.name || 'Unknown Subject'}</span>
              </div>
              <p className="font-bold text-lg text-gray-800">{assignment.title}</p>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600 flex-grow">
            {assignment.description}
          </p>

          {auth?.user?.role === Role.STUDENT && studentSubmission?.status === SubmissionStatus.GRADED && (
              <div className="my-4 text-center bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Your Score</p>
                <p className="text-2xl font-bold text-act-blue">{studentSubmission.marks} <span className="text-lg font-medium text-gray-500">/ {assignment.totalMarks}</span></p>
              </div>
          )}
          
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
                <p className={`text-sm font-semibold ${dateColor}`}>
                Due: {formattedDate}
                </p>
              {auth?.user?.role === Role.STUDENT && renderStudentActions()}
            </div>
            
            <div className="mt-3">
              {auth?.user?.role === Role.TEACHER && renderTeacherActions()}
            </div>
          </div>
        </div>
      </div>
      
      {auth?.user?.role === Role.TEACHER && isViewSubmissionsModalOpen && onGrade && (
        <ViewSubmissionsModal
          assignment={assignment}
          submissions={submissions}
          onClose={() => setViewSubmissionsModalOpen(false)}
          onGrade={onGrade}
        />
      )}

      {auth?.user?.role === Role.TEACHER && isEditModalOpen && onUpdate && (
        <EditAssignmentModal
          assignment={assignment}
          onClose={() => setEditModalOpen(false)}
          onUpdate={(updatedAssignment) => {
            onUpdate(updatedAssignment);
            setEditModalOpen(false);
          }}
        />
      )}

      {auth?.user?.role === Role.STUDENT && isSubmitModalOpen && onNewSubmission && (
         <SubmitAssignmentModal
          assignment={assignment}
          onClose={() => setSubmitModalOpen(false)}
          onSubmit={onNewSubmission}
        />
      )}
    </>
  );
};

export default AssignmentCard;