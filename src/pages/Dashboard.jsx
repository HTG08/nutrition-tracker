import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import { motion } from 'framer-motion';
import { Flame, Droplets, Target, Award, Plus, Minus, Dumbbell, Activity, Footprints, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { 
    hydration, 
    dailyGoal, 
    caloriesConsumed, 
    streak, 
    cheatDays,
    workoutTypes,
    steps,
    workoutStreak,
    addWater,
    removeWater,
    toggleWorkoutType,
    completeWorkout,
    setSteps
  } = useNutrition();

  const progress = Math.min((caloriesConsumed / dailyGoal) * 100, 100);
  const remaining = dailyGoal - caloriesConsumed;

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-bold text-text mb-2">Hello, {currentUser?.name || 'there'}! 👋</h1>
        <p className="text-text-muted">Here is your daily nutrition overview.</p>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={<Flame className="text-orange-500 w-6 h-6"/>} title="Calories Consumed" value={caloriesConsumed} subtitle={`Goal: ${dailyGoal}`} />
        <StatCard icon={<Target className="text-blue-500 w-6 h-6"/>} title="Remaining" value={remaining > 0 ? remaining : 0} subtitle="kcal left today" />
        <StatCard icon={<Award className="text-yellow-500 w-6 h-6"/>} title="Food Streak" value={`${streak} Days`} subtitle={`${cheatDays} Cheat Days`} />
        <StatCard icon={<Activity className="text-purple-500 w-6 h-6"/>} title="Workout Streak" value={`${workoutStreak} Days`} subtitle="Keep moving!" />
        
        {/* Hydration Interactive Card */}
        <div className="bg-surface p-6 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Droplets className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-text-muted font-medium">Hydration</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-text">{hydration} <span className="text-lg text-text-muted font-normal">/ 8 glasses</span></span>
            <div className="flex space-x-2">
              <button onClick={removeWater} className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition"><Minus className="w-4 h-4"/></button>
              <button onClick={addWater} className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition"><Plus className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calorie Progress Ring */}
        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-2xl font-bold mb-6 text-text">Daily Progress</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Custom Circular Progress */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="10" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                  className="text-primary" strokeWidth="10" 
                  strokeDasharray={`${progress * 2.83} 283`} // 2 * pi * 45 = 282.7
                  initial={{ strokeDasharray: "0 283" }}
                  animate={{ strokeDasharray: `${progress * 2.83} 283` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text">{Math.round(progress)}%</span>
              </div>
            </div>
            
            <div className="space-y-4 flex-1 w-full">
              <ProgressBar label="Carbs" value={45} color="bg-blue-500" />
              <ProgressBar label="Protein" value={30} color="bg-red-500" />
              <ProgressBar label="Fat" value={25} color="bg-yellow-500" />
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-center text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="text-emerald-500 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">Stay on track!</h2>
          <p className="text-text-muted mb-6">You need to consume {remaining > 0 ? remaining : 0} more calories today to reach your target.</p>
          <a href="/tracker" className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20">
            Log a Meal
          </a>
        </div>
      </div>

      {/* Workout & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Workout of the Day */}
        <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Activity className="text-purple-500 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-text">Workout of the Day</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button 
              onClick={() => toggleWorkoutType('weights')}
              className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${workoutTypes.includes('weights') ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-text-muted hover:border-slate-500'}`}
            >
              <Dumbbell className="w-6 h-6" />
              <span className="font-semibold text-sm">Weights</span>
              {workoutTypes.includes('weights') && <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-purple-500" />}
            </button>

            <button 
              onClick={() => toggleWorkoutType('cardio')}
              className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${workoutTypes.includes('cardio') ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-800 border-slate-700 text-text-muted hover:border-slate-500'}`}
            >
              <Flame className="w-6 h-6" />
              <span className="font-semibold text-sm">Cardio</span>
              {workoutTypes.includes('cardio') && <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-orange-500" />}
            </button>

            <button 
              onClick={() => toggleWorkoutType('low_intensity')}
              className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all text-center ${workoutTypes.includes('low_intensity') ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-text-muted hover:border-slate-500'}`}
            >
              <Activity className="w-6 h-6" />
              <span className="font-semibold text-xs">Low Intensity</span>
              {workoutTypes.includes('low_intensity') && <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-emerald-500" />}
            </button>
          </div>
          
          <button 
            onClick={completeWorkout}
            disabled={workoutTypes.length === 0}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition shadow-lg ${workoutTypes.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Complete Workout</span>
          </button>
        </div>

        {/* Steps Goal */}
        <div className="bg-surface p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Footprints className="text-blue-500 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-text">Steps Goal</h2>
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <span className="text-4xl font-bold text-text">{steps.toLocaleString()} <span className="text-lg text-text-muted font-normal">/ 10,000</span></span>
          </div>

          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-blue-500" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((steps / 10000) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setSteps(Math.max(steps - 500, 0))}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition flex-1"
            >
              - 500
            </button>
            <button 
              onClick={() => setSteps(Math.min(steps + 1000, 50000))}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition flex-1 shadow-lg shadow-blue-500/20"
            >
              + 1,000 Steps
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="bg-surface p-6 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden group hover:border-slate-600 transition-colors">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-text-muted font-medium">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-text mb-1">{value}</div>
      <div className="text-sm text-text-muted">{subtitle}</div>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-text">{label}</span>
        <span className="text-text-muted">{value}%</span>
      </div>
      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`} 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </div>
    </div>
  );
}
