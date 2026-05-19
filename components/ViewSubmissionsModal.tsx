
import React, { useState } from 'react';
import { Assignment, Submission, SubmissionStatus } from '../types';
import { MOCK_USERS } from '../constants';
import { gradeSubmission } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface ViewSubmissionsModalProps {
  assignment: Assignment;
  submissions: Submission[];
  onClose: () => void;
  onGrade: (updatedSubmissions: Submission[]) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ViewSubmissionsModal: React.FC<ViewSubmissionsModalProps> = ({ assignment, submissions, onClose, onGrade }) => {
  const [grades, setGrades] = useState<Record<string, number | string>>(() => {
    return submissions.reduce((acc, sub) => {
        if (sub.marks !== undefined) {
            acc[sub.id] = sub.marks;
        } else {
            const isLate = sub.status === SubmissionStatus.LATE;
            acc[sub.id] = isLate ? Math.floor(assignment.totalMarks / 2) : assignment.totalMarks;
        }
        return acc;
    }, {} as Record<string, number | string>);
  });
  
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [aiFeedback, setAiFeedback] = useState<Record<string, string>>({});

  const handleGradeChange = (submissionId: string, marks: string) => {
    if (marks === '') {
        setGrades(prev => ({ ...prev, [submissionId]: '' }));
        return;
    }
    const numericMarks = parseInt(marks, 10);
    if (!isNaN(numericMarks)) {
        const clampedMarks = Math.max(0, Math.min(numericMarks, assignment.totalMarks));
        setGrades(prev => ({ ...prev, [submissionId]: clampedMarks }));
    }
  };

  const handleSaveGrades = () => {
    const updatedSubmissions = submissions.map(sub => {
        const grade = grades[sub.id];
        if (typeof grade === 'number' && !isNaN(grade)) {
            return { ...sub, marks: grade, status: SubmissionStatus.GRADED };
        }
        return sub;
    });
    onGrade(updatedSubmissions);
    onClose();
  };

  const handleGradeWithAI = async (submission: Submission) => {
    if (!submission.fileContent) {
        alert("This submission does not have content to analyze.");
        return;
    }

    setAnalyzingIds(prev => new Set(prev).add(submission.id));
    setAiFeedback(prev => ({ ...prev, [submission.id]: '' }));

    try {
        const result = await gradeSubmission(
            {
                title: assignment.title,
                description: assignment.description,
                totalMarks: assignment.totalMarks
            },
            submission.fileContent
        );

        setGrades(prev => ({ ...prev, [submission.id]: result.suggestedGrade }));
        setAiFeedback(prev => ({ ...prev, [submission.id]: result.feedback }));

    } catch (error) {
        console.error("AI grading failed", error);
        alert("Failed to analyze the submission. Please try again.");
    } finally {
        setAnalyzingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(submission.id);
            return newSet;
        });
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-act-blue">Submissions for "{assignment.title}"</h3>
          <p className="text-sm text-gray-500">Total Marks: {assignment.totalMarks}</p>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {submissions.length > 0 ? (
            <ul className="space-y-4">
              {submissions.map(sub => {
                const student = MOCK_USERS.find(u => u.id === sub.studentId);
                const isLate = sub.status === SubmissionStatus.LATE;
                const isAnalyzing = analyzingIds.has(sub.id);
                
                return (
                  <li key={sub.id} className={`p-4 bg-gray-50 rounded-md border-l-4 transition-all ${isLate ? 'border-yellow-500' : 'border-green-500'}`}>
                    <div className="grid grid-cols-12 items-center gap-4">
                        <div className="col-span-3">
                            <div className="flex items-baseline gap-1.5">
                                <p className="font-semibold text-gray-800 truncate" title={student?.name || 'Unknown Student'}>{student?.name || 'Unknown Student'}</p>
                                <p className="text-sm text-gray-500 flex-shrink-0">({student?.id || 'No ID'})</p>
                            </div>
                            {isLate ? (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                    <p className="text-xs font-bold text-yellow-600">Submitted Late</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <p className="text-xs font-bold text-green-600">On Time</p>
                                </div>
                            )}
                        </div>
                        <div className="col-span-3 text-center">
                            <a 
                                href={sub.fileContent}
                                download={sub.file.name}
                                className="text-sm text-blue-600 hover:underline font-medium block truncate"
                                title={`Download "${sub.file.name}"`}
                            >
                                {sub.file.name}
                            </a>
                            <p className="text-xs text-gray-500">{formatFileSize(sub.file.size)}</p>
                        </div>
                        <div className="col-span-6 flex items-center justify-end gap-2">
                            <button
                                onClick={() => handleGradeWithAI(sub)}
                                disabled={isAnalyzing}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-act-gold text-act-blue text-sm font-semibold rounded-md shadow-sm hover:opacity-90 disabled:bg-gray-300 disabled:cursor-wait"
                            >
                                {isAnalyzing ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-act-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <SparklesIcon className="h-4 w-4" />
                                )}
                                <span>{isAnalyzing ? 'Analyzing...' : 'AI Grade'}</span>
                            </button>
                             <input 
                                type="number"
                                value={grades[sub.id] ?? ''}
                                onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                                onFocus={(e) => e.target.select()}
                                max={assignment.totalMarks}
                                min="0"
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-act-blue focus:border-act-blue"
                             />
                             <span className="text-gray-500 font-medium">/ {assignment.totalMarks}</span>
                        </div>
                    </div>
                    {aiFeedback[sub.id] && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm font-semibold text-act-blue flex items-center gap-2"><SparklesIcon className="h-4 w-4" /> AI Feedback</p>
                            <p className="mt-1 text-sm text-gray-700">{aiFeedback[sub.id]}</p>
                        </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-600 py-8">No submissions yet.</p>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
           {submissions.length > 0 && (
             <button onClick={handleSaveGrades} className="px-4 py-2 bg-act-red text-white rounded-md hover:bg-red-700">Save Grades</button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissionsModal;
