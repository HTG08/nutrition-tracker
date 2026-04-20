import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Apple, Dumbbell, Scale, ChevronRight } from 'lucide-react';

export default function Suggestions() {
  const { currentUser } = useAuth();

  const suggestions = useMemo(() => {
    const goal = currentUser?.goal || 'maintain';
    
    if (goal === 'lose') {
      return [
        { name: 'Grilled Chicken Salad', cals: 350, protein: 40, tags: ['Low Calorie', 'High Protein'] },
        { name: 'Zucchini Noodles with Pesto', cals: 200, protein: 5, tags: ['Low Carb', 'Vegan'] },
        { name: 'Greek Yogurt with Berries', cals: 150, protein: 15, tags: ['Snack', 'High Protein'] },
        { name: 'Egg White Omelet', cals: 180, protein: 25, tags: ['Breakfast', 'Low Fat'] },
      ];
    } else if (goal === 'gain') {
      return [
        { name: 'Peanut Butter Banana Smoothie', cals: 600, protein: 30, tags: ['High Calorie', 'Post-Workout'] },
        { name: 'Salmon with Sweet Potato', cals: 550, protein: 45, tags: ['Healthy Fats', 'Dinner'] },
        { name: 'Oatmeal with Almonds & Honey', cals: 450, protein: 12, tags: ['Carbs', 'Breakfast'] },
        { name: 'Steak and Rice', cals: 700, protein: 50, tags: ['High Protein', 'Bulking'] },
      ];
    }
    
    // Maintain
    return [
      { name: 'Turkey Wrap', cals: 400, protein: 25, tags: ['Balanced', 'Lunch'] },
      { name: 'Quinoa Bowl with Tofu', cals: 450, protein: 20, tags: ['Vegan', 'Balanced'] },
      { name: 'Avocado Toast with Egg', cals: 350, protein: 15, tags: ['Healthy Fats', 'Breakfast'] },
      { name: 'Mixed Nuts', cals: 200, protein: 6, tags: ['Snack', 'Healthy Fats'] },
    ];
  }, [currentUser]);

  const getGoalIcon = () => {
    if (currentUser?.goal === 'lose') return <Scale className="w-8 h-8 text-blue-500" />;
    if (currentUser?.goal === 'gain') return <Dumbbell className="w-8 h-8 text-orange-500" />;
    return <Apple className="w-8 h-8 text-emerald-500" />;
  };

  const getGoalText = () => {
    if (currentUser?.goal === 'lose') return "Cutting (Weight Loss)";
    if (currentUser?.goal === 'gain') return "Bulking (Muscle Gain)";
    return "Maintaining Weight";
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold text-text mb-2">Food Suggestions</h1>
        <p className="text-text-muted">Personalized meals based on your physique and goals.</p>
      </header>

      {/* Profile Summary Card */}
      <div className="bg-gradient-to-r from-surface to-slate-800 p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-sm text-text-muted mb-1 uppercase tracking-wider font-semibold">Current Goal</div>
          <h2 className="text-2xl font-bold text-text">{getGoalText()}</h2>
          <div className="mt-2 text-text-muted">
            Based on your profile: {currentUser?.weight}kg targeting {currentUser?.targetWeight}kg
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a 
            href="https://recipe-finder-beryl-two.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-secondary hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            Find More Recipes 🍳
          </a>
          <div className="p-4 bg-slate-900/50 rounded-2xl hidden md:block">
            {getGoalIcon()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((meal, idx) => (
          <div key={idx} className="bg-surface p-6 rounded-3xl border border-slate-700/50 shadow-lg hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">{meal.name}</h3>
              <div className="p-2 bg-slate-800 rounded-full group-hover:bg-primary/20 transition-colors">
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-text">{meal.cals}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Calories</span>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-text">{meal.protein}g</span>
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Protein</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {meal.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-800 text-text-muted text-xs font-semibold rounded-full border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
