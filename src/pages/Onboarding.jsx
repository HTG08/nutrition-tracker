import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Onboarding() {
  const { currentUser, isMock, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    weight: '',
    height: '',
    targetWeight: '',
    goal: 'maintain',
    activityLevel: 'moderate'
  });

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (currentUser?.uid) {
        // Try to update Firebase only if not in mock mode
        if (!isMock) {
          try {
            await setDoc(doc(db, 'users', currentUser.uid), formData, { merge: true });
          } catch (e) {
            console.warn("Firebase save failed, falling back to mock", e);
          }
        }
        
        // Always update mock local storage for fallback testing
        const mockUser = JSON.parse(localStorage.getItem('mockUser')) || currentUser;
        localStorage.setItem('mockUser', JSON.stringify({ ...mockUser, ...formData }));
        
        // Update the AuthContext state immediately
        updateCurrentUser(formData);
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-xl w-full bg-surface p-8 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
          <motion.div 
            className="bg-primary h-2 rounded-full"
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-bold mb-6 text-text">Welcome! Let's get to know you.</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-bold mb-6 text-text">Your Physique</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Current Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="70" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="175" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-bold mb-6 text-text">Your Goals</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Target Weight (kg)</label>
                  <input type="number" name="targetWeight" value={formData.targetWeight} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="65" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Primary Goal</label>
                  <select name="goal" value={formData.goal} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="lose">Lose Weight (Cut)</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Muscle (Bulk)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-bold mb-6 text-text">Activity Level</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">How active are you?</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={updateForm} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="sedentary">Sedentary (Little or no exercise)</option>
                    <option value="light">Light (Exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                    <option value="active">Active (Exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (Hard exercise/sports)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={prevStep} className="px-6 py-3 bg-slate-700 text-text rounded-xl font-medium hover:bg-slate-600 transition">Back</button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button onClick={nextStep} className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition">Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
