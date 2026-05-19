import React, { useState, useContext, useRef } from 'react';
import { Assignment, Submission, SubmissionStatus } from '../types';
import { AuthContext } from '../App';
import { UploadIcon } from './icons/UploadIcon';

interface SubmitAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
  onSubmit: (submission: Submission) => void;
}

// File validation constants
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
];
const ALLOWED_EXTENSIONS_TEXT = 'PDF, DOCX, or ZIP';
const MAX_FILE_SIZE_MB = 15;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({ assignment, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // An inlined icon component for better visual feedback on error
  const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFile(null);

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Check file type
      if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
        setError(`Invalid file type. Please upload a ${ALLOWED_EXTENSIONS_TEXT} file.`);
        return;
      }

      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !auth?.user) {
      setError('Please select a file to submit.');
      return;
    }

    setIsSubmitting(true);
    
    try {
        const fileContent = await fileToBase64(file);
        const submittedAt = new Date();
        const dueDate = new Date(assignment.dueDate);
        
        const newSubmission: Submission = {
            id: `SUB${Date.now()}`,
            assignmentId: assignment.id,
            studentId: auth.user.id,
            submittedAt: submittedAt.toISOString(),
            file: {
            name: file.name,
            size: file.size,
            },
            fileContent: fileContent,
            status: submittedAt > dueDate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED,
        };

        // Simulate API call
        setTimeout(() => {
            onSubmit(newSubmission);
            setIsSubmitting(false);
            onClose();
        }, 1000);

    } catch (err) {
        setError("Could not process the file. Please try again.");
        setIsSubmitting(false);
    }
  };
  
  const triggerFileSelect = () => {
    // Clear previous selection from input to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null); // Clear error when user tries to select a new file
    fileInputRef.current?.click();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-act-blue">Submit Assignment</h3>
            <p className="text-sm text-gray-500">{assignment.title}</p>
          </div>
          <div className="p-6">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              accept=".pdf,.docx,.zip"
            />
            <div
              onClick={triggerFileSelect}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${error ? 'border-red-400 bg-red-50 hover:border-red-500' : 'border-gray-300 hover:border-act-blue'}`}
            >
              <div className="space-y-1 text-center">
                {error ? (
                    <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
                ) : (
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                    <span className={`relative rounded-md font-medium ${error ? 'text-red-600' : 'text-act-red hover:text-red-700'}`}>
                        {error ? 'Please select a valid file' : 'Click to upload'}
                    </span>
                    {!error && <p className="pl-1">or drag and drop</p>}
                </div>
                {file && !error ? (
                   <p className="text-sm text-green-600 font-semibold pt-2">{file.name}</p>
                ) : (
                   <p className="text-xs text-gray-500">{ALLOWED_EXTENSIONS_TEXT} up to {MAX_FILE_SIZE_MB}MB</p>
                )}
              </div>
            </div>
            {error && <p className="mt-2 text-sm font-medium text-red-600 text-center">{error}</p>}
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !file} className="px-4 py-2 bg-act-red text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignmentModal;