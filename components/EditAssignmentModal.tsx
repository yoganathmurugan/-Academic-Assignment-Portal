import React, { useState } from 'react';
import { Assignment } from '../types';

interface EditAssignmentModalProps {
  assignment: Assignment;
  onClose: () => void;
  onUpdate: (assignment: Assignment) => void;
}

const formatDateTimeForInput = (isoString: string) => {
    const date = new Date(isoString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
};


const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({ assignment, onClose, onUpdate }) => {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [dueDate, setDueDate] = useState(formatDateTimeForInput(assignment.dueDate));
  const [totalMarks, setTotalMarks] = useState(assignment.totalMarks);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      alert('Please fill all fields');
      return;
    }
    onUpdate({
      ...assignment,
      title,
      description,
      dueDate: new Date(dueDate).toISOString(),
      totalMarks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-act-blue">Edit Assignment</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input type="datetime-local" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700">Total Marks</label>
                    <input type="number" id="totalMarks" value={totalMarks} onChange={(e) => setTotalMarks(parseInt(e.target.value, 10))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
                </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-act-red text-white rounded-md hover:bg-red-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentModal;
