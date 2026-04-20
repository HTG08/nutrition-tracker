import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Apple, Droplets, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-3xl px-6"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-surface rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700">
            <Apple className="text-primary w-8 h-8" />
            <Activity className="text-secondary w-8 h-8" />
            <Droplets className="text-blue-500 w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Nutrition</span>
        </h1>
        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          Track calories, stay hydrated, and get personalized food suggestions based on your unique body goals. Build streaks and earn your cheat days.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/signup" 
            className="group relative px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Start Your Journey</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 bg-surface text-text hover:bg-slate-700 font-semibold rounded-full border border-slate-600 transition-colors"
          >
            I already have an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
