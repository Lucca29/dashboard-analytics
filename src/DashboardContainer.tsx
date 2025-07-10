import React, { useState } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import App from './App';
import BlankDashboard from './BlankDashboard';

const DashboardContainer = () => {
  const [currentView, setCurrentView] = useState('with-data');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Navigation entre les versions */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 p-1 rounded-full shadow-inner">
              <button
                onClick={() => setCurrentView('with-data')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentView === 'with-data'
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-md'
                }`}
              >
                <BarChart3 size={18} />
                <span>Tableau avec données</span>
              </button>
              <button
                onClick={() => setCurrentView('blank')}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentView === 'blank'
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-md'
                }`}
              >
                <FileText size={18} />
                <span>Tableau vierge</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-2">
        {currentView === 'with-data' ? <App /> : <BlankDashboard />}
      </div>
    </div>
  );
};

export default DashboardContainer; 