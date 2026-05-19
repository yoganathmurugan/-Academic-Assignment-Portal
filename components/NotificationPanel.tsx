import React, { useContext } from 'react';
import { NotificationContext } from '../App';
import { BellIcon } from './icons/BellIcon';

const TimeAgo = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

const NotificationPanel: React.FC = () => {
    const context = useContext(NotificationContext);

    if (!context) return null;

    const { notifications, dismissNotification } = context;

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800">
            <div className="p-4 font-semibold border-b">
                Notifications
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    <ul>
                        {notifications.map(notif => (
                            <li key={notif.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm">{notif.title}</p>
                                            <p className="text-sm text-gray-600">{notif.message}</p>
                                        </div>
                                        <button onClick={() => dismissNotification(notif.id)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1"><TimeAgo dateString={notif.timestamp} /></p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-8">
                        <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-sm text-gray-500">You're all caught up!</p>
                        <p className="text-xs text-gray-400">We'll notify you when there's something new.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;