import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, UtensilsCrossed } from 'lucide-react';

export default function Tracker() {
  const { meals, addMeal, removeMeal, caloriesConsumed } = useNutrition();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', calories: '', type: 'breakfast' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.calories) return;
    
    addMeal({
      name: formData.name,
      calories: Number(formData.calories),
      type: formData.type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    setFormData({ name: '', calories: '', type: 'breakfast' });
    setIsAdding(false);
  };

  const getMealsByType = (type) => meals.filter(m => m.type === type);

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">Food Log</h1>
          <p className="text-text-muted">Track your daily intake</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{caloriesConsumed}</div>
          <div className="text-sm text-text-muted">kcal consumed</div>
        </div>
      </header>

      {/* Add Meal Form */}
      <div className="bg-surface p-6 rounded-3xl border border-slate-700/50 shadow-xl">
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-slate-600 rounded-2xl flex items-center justify-center space-x-2 text-text-muted hover:text-primary hover:border-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Entry</span>
          </button>
        ) : (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-text">New Entry</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-text-muted hover:text-text">Cancel</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Food name (e.g. Oatmeal)" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input 
                type="number" 
                placeholder="Calories" 
                required
                value={formData.calories}
                onChange={e => setFormData({...formData, calories: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition">Save Entry</button>
          </motion.form>
        )}
      </div>

      {/* Meal Lists */}
      <div className="space-y-6">
        {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
          <MealSection key={type} title={type} items={getMealsByType(type)} onRemove={removeMeal} />
        ))}
      </div>

    </div>
  );
}

function MealSection({ title, items, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="bg-surface rounded-3xl border border-slate-700/50 overflow-hidden shadow-lg">
      <div className="bg-slate-800/50 px-6 py-4 flex justify-between items-center border-b border-slate-700/50">
        <h3 className="font-bold text-text capitalize flex items-center space-x-2">
          <UtensilsCrossed className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </h3>
        <span className="font-semibold text-text-muted">{total} kcal</span>
      </div>
      
      <div className="p-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">No entries yet</div>
          ) : (
            items.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-2xl transition group"
              >
                <div>
                  <div className="font-medium text-text">{item.name}</div>
                  <div className="text-xs text-text-muted">{item.time}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-text">{item.calories} <span className="text-sm font-normal text-text-muted">kcal</span></span>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
