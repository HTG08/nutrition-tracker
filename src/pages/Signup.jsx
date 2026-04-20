import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password, { role: 'user' });
      navigate('/onboarding');
    } catch (err) {
      setError('Failed to create an account. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface p-8 rounded-3xl shadow-2xl border border-slate-700/50"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-text">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Confirm Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-4 mt-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            type="submit"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-text-muted">
          Already have an account? <Link to="/login" className="text-primary hover:text-emerald-400 font-medium">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
}
