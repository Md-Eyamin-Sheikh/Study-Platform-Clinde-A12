import React, { useState, useContext } from 'react';
import { BookOpen, FileText, Edit, Download } from 'lucide-react';
import { AuthContext } from '../../../providers/AuthProvider';
import ViewBookedSessions from './Component/ViewBookedSessions';
import CreateNote from './Component/CreateNote';
import ManageNotes from './Component/ManageNotes';
import ViewMaterials from './Component/ViewMaterials';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('booked');
  const { user, role } = useContext(AuthContext);

  const tabs = [
    { id: 'booked', label: 'Booked Sessions', icon: BookOpen },
    { id: 'create-note', label: 'Create Note', icon: Edit },
    { id: 'manage-notes', label: 'Manage Notes', icon: FileText },
    { id: 'materials', label: 'Study Materials', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 px-2">Student Dashboard</h1>
          
          {user && (
            <div className="flex items-center space-x-3 mt-3 sm:mt-0 px-2">
              <img 
                src={user.photoURL || '/default-avatar.png'} 
                alt="Profile" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="text-sm sm:text-base font-medium text-gray-900">{user.displayName || user.email}</p>
                <p className="text-xs sm:text-sm text-gray-500">{role || 'Student'}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide px-2 sm:px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap min-w-fit ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-3 sm:p-6">
            {activeTab === 'booked' && <ViewBookedSessions />}
            {activeTab === 'create-note' && <CreateNote />}
            {activeTab === 'manage-notes' && <ManageNotes />}
            {activeTab === 'materials' && <ViewMaterials />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
