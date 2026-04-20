import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, ListPlus, Utensils, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-slate-700/50 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
            NutriTrack
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-slate-800 hover:text-text'}`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/tracker" 
            className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-slate-800 hover:text-text'}`}
          >
            <ListPlus className="w-5 h-5" />
            <span className="font-medium">Log Meal</span>
          </NavLink>

          <NavLink 
            to="/suggestions" 
            className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-slate-800 hover:text-text'}`}
          >
            <Utensils className="w-5 h-5" />
            <span className="font-medium">Suggestions</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-text-muted hover:bg-red-500/10 hover:text-red-400 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
