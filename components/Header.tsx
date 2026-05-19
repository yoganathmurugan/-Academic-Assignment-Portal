import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext, NotificationContext } from '../App';
import { BellIcon } from './icons/BellIcon';
import NotificationPanel from './NotificationPanel';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  onNavigateToProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToProfile }) => {
  const auth = useContext(AuthContext);
  const notificationsCtx = useContext(NotificationContext);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const notificationCount = notificationsCtx?.notifications.length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setIsPanelOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef, dropdownRef]);
  
  const handleBellClick = () => {
    setIsPanelOpen(prev => !prev);
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
        <div>
          <img src="https://i.ibb.co/GQLF2W8/act-logo-name.png" alt="Agni College of Technology" className="h-12"/>
        </div>
        
        {auth?.user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={panelRef}>
                <button 
                  onClick={handleBellClick}
                  className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-act-blue"
                  aria-label={`Notifications (${notificationCount} unread)`}
                >
                    <BellIcon />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-act-red ring-2 ring-white text-xs flex items-center justify-center text-white font-semibold">
                            {notificationCount}
                        </span>
                    )}
                </button>
                {isPanelOpen && <NotificationPanel />}
            </div>
            
            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-act-blue"
                >
                   <div className="h-9 w-9 rounded-full bg-act-blue text-white flex items-center justify-center font-bold text-md">
                    {auth.user.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-800 hidden sm:inline">{auth.user.name}</span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 hidden sm:inline" />
                </button>
                 {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-2xl border border-gray-200 z-50 overflow-hidden">
                        <div className="p-3 border-b">
                            <p className="font-semibold text-sm text-gray-800 truncate">{auth.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                        </div>
                        <nav className="p-1">
                            <button
                                onClick={() => { onNavigateToProfile(); setDropdownOpen(false); }}
                                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                <UserIcon className="h-5 w-5 text-gray-500"/>
                                View Profile
                            </button>
                            <button
                                onClick={() => { auth.logout(); setDropdownOpen(false); }}
                                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                            >
                                <LogoutIcon className="h-5 w-5"/>
                                Logout
                            </button>
                        </nav>
                    </div>
                 )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;