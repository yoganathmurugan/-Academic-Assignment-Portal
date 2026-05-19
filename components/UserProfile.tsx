import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { UserIcon } from './icons/UserIcon';

interface UserProfileProps {
    onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-md text-gray-900">{value}</p>
    </div>
);

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
    const auth = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!auth?.user) return null;
    const user = auth.user;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }
        
        // Mock success for demonstration
        alert("Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="container mx-auto max-w-4xl">
             <div className="mb-6">
                <button onClick={onBack} className="text-sm font-semibold text-act-blue hover:underline">
                    &larr; Back to Dashboard
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-act-blue text-white flex items-center justify-center text-3xl font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-md text-gray-600 capitalize">{user.role} Profile</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-act-blue mb-4">Your Information</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                            <DetailItem label="Student/Staff ID" value={user.id} />
                            <DetailItem label="Email Address" value={user.email} />
                            <DetailItem label="Department" value={user.department} />
                            <DetailItem label="Year" value={user.year} />
                        </dl>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-act-blue mb-4">Change Password</h3>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                             <div>
                                <label htmlFor="current-password"className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="new-password"className="block text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-act-blue focus:border-act-blue sm:text-sm" />
                            </div>
                            <div>
                               <button type="submit" className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-act-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Update Password
                               </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
