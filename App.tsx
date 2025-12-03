import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Terminal } from 'lucide-react';
import Store from './components/Store';
import Dashboard from './components/Dashboard';
import { UserEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  // Simple "Routing" state
  const [currentView, setCurrentView] = useState<'store' | 'dashboard'>('store');
  
  // The "Database" of user actions
  const [events, setEvents] = useState<UserEvent[]>([]);

  // The tracking function used by the Store
  const trackEvent = (type: UserEvent['type'], details: string) => {
    const newEvent: UserEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      type,
      details,
    };
    setEvents((prev) => [...prev, newEvent]);
    console.log(`[Tracker] New Event: ${type} - ${details}`);
  };

  const clearEvents = () => {
      setEvents([]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* View Switcher - Simulates moving between the "App" and the "Backend" */}
      <div className="bg-zinc-900 text-white p-2 flex justify-center space-x-4 border-b border-zinc-700 shadow-lg z-50">
        <button
          onClick={() => setCurrentView('store')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentView === 'store' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <ShoppingBag size={16} className="mr-2" />
          E-Commerce App (User View)
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentView === 'dashboard' 
            ? 'bg-emerald-600 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <LayoutDashboard size={16} className="mr-2" />
          Analytics & AI (Marketer View)
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-100">
        {currentView === 'store' ? (
          <Store trackEvent={trackEvent} />
        ) : (
          <Dashboard events={events} onClearEvents={clearEvents} />
        )}
      </div>

      {/* Footer / Credits */}
      {currentView === 'store' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur text-xs flex items-center shadow-xl max-w-sm pointer-events-none">
          <Terminal size={14} className="mr-2 text-green-400" />
          <div>
            <p className="font-bold">Tracking Active</p>
            <p className="opacity-75">Every click is being sent to the AI Dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;