import React, { useState } from 'react';
import { Assignment, Subject } from '../types';
import { generateAssignmentIdeas, AssignmentIdea } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreateAssignmentModalProps {
  subject: Subject;
  onClose: () => void;
  onCreate: (assignment: Omit<Assignment, 'id'>) => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ subject, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState(10);
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<AssignmentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      alert('Please fill all fields');
      return;
    }
    onCreate({
      title,
      description,
      subjectId: subject.id,
      dueDate: new Date(dueDate).toISOString(),
      totalMarks,
    });
    onClose();
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    const generatedIdeas = await generateAssignmentIdeas(subject.name, topic);
    setIdeas(generatedIdeas);
    setIsGenerating(false);
  };

  const useIdea = (idea: AssignmentIdea) => {
    setTitle(idea.title);
    setDescription(idea.description);
    setIdeas([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-act-blue">Create New Assignment</h3>
          <p className="text-sm text-gray-500">For {subject.name}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic for Idea Generation (Optional)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 'Binary Trees' or leave blank for general ideas"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleGenerateIdeas}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-act-gold text-act-blue font-semibold rounded-lg shadow hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-wait"
                >
                  <SparklesIcon /> {isGenerating ? 'Generating...' : 'Get Ideas'}
                </button>
              </div>
              {ideas.length > 0 && (
                 <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                    {ideas.map((idea, index) => (
                        <div key={index} className="p-3 bg-white rounded-md border flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800">{idea.title}</p>
                                <p className="text-sm text-gray-600">{idea.description}</p>
                            </div>
                            <button type="button" onClick={() => useIdea(idea)} className="text-sm bg-act-blue text-white px-3 py-1 rounded-md hover:bg-blue-800">Use</button>
                        </div>
                    ))}
                 </div>
              )}
            </div>

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
            <button type="submit" className="px-4 py-2 bg-act-red text-white rounded-md hover:bg-red-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;