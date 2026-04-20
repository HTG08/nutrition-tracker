import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NutritionContext = createContext();

export function useNutrition() {
  return useContext(NutritionContext);
}

export function NutritionProvider({ children }) {
  const { currentUser } = useAuth();
  
  // States
  const [hydration, setHydration] = useState(0); // in glasses
  const [meals, setMeals] = useState([]); // array of meal objects
  const [streak, setStreak] = useState(0);
  const [cheatDays, setCheatDays] = useState(0);
  const [workoutTypes, setWorkoutTypes] = useState([]); // array of 'weights', 'cardio', 'low_intensity'
  const [steps, setSteps] = useState(0);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load daily data
  useEffect(() => {
    if (!currentUser) return;
    
    // In a real app, this would fetch from Firebase based on today's date
    const today = new Date().toISOString().split('T')[0];
    const savedData = JSON.parse(localStorage.getItem(`nutrition_${currentUser.email}_${today}`)) || {};
    
    setHydration(savedData.hydration || 0);
    setMeals(savedData.meals || []);
    setWorkoutTypes(savedData.workoutTypes || []);
    setSteps(savedData.steps || 0);
    
    // Load streak data
    const streakData = JSON.parse(localStorage.getItem(`streak_${currentUser.email}`)) || { streak: 0, cheatDays: 0 };
    setStreak(streakData.streak);
    setCheatDays(streakData.cheatDays);

    // Load workout streak data
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
    
    let wStreakData = JSON.parse(localStorage.getItem(`workout_streak_${currentUser.email}`)) || { count: 0, lastDate: null };
    
    // Reset streak if last active day was before yesterday
    if (wStreakData.lastDate && wStreakData.lastDate !== today && wStreakData.lastDate !== yesterdayStr) {
      wStreakData.count = 0;
      localStorage.setItem(`workout_streak_${currentUser.email}`, JSON.stringify(wStreakData));
    }
    setWorkoutStreak(wStreakData.count);
    
    setIsLoaded(true);
  }, [currentUser]);

  // Save daily data
  useEffect(() => {
    if (!isLoaded || !currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`nutrition_${currentUser.email}_${today}`, JSON.stringify({ hydration, meals, workoutTypes, steps }));
  }, [hydration, meals, workoutTypes, steps, currentUser, isLoaded]);

  // Save streak data
  useEffect(() => {
    if (!isLoaded || !currentUser) return;
    localStorage.setItem(`streak_${currentUser.email}`, JSON.stringify({ streak, cheatDays }));
  }, [streak, cheatDays, currentUser, isLoaded]);

  // Derived state: Caloric Needs
  const dailyGoal = useMemo(() => {
    if (!currentUser?.weight || !currentUser?.height) return 2000; // Default

    // Simple BMR calculation (Mifflin-St Jeor Equation approximation)
    let bmr = (10 * currentUser.weight) + (6.25 * currentUser.height) - (5 * 25); // assuming age 25
    if (currentUser.gender === 'male') bmr += 5;
    else bmr -= 161;

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const tdee = bmr * (activityMultipliers[currentUser.activityLevel] || 1.2);

    // Goal adjustment
    if (currentUser.goal === 'lose') return Math.round(tdee - 500);
    if (currentUser.goal === 'gain') return Math.round(tdee + 300);
    return Math.round(tdee);

  }, [currentUser]);

  const caloriesConsumed = useMemo(() => {
    return meals.reduce((total, meal) => total + Number(meal.calories), 0);
  }, [meals]);

  // Actions
  const addWater = useCallback(() => setHydration(prev => Math.min(prev + 1, 15)), []);
  const removeWater = useCallback(() => setHydration(prev => Math.max(prev - 1, 0)), []);
  
  const addMeal = useCallback((meal) => {
    setMeals(prev => [...prev, { ...meal, id: Date.now().toString() }]);
  }, []);

  const removeMeal = useCallback((id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  }, []);

  const toggleWorkoutType = useCallback((type) => {
    setWorkoutTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  }, []);

  const completeWorkout = useCallback(() => {
    if (!currentUser || workoutTypes.length === 0) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    let wStreakData = JSON.parse(localStorage.getItem(`workout_streak_${currentUser.email}`)) || { count: 0, lastDate: null };
    
    if (wStreakData.lastDate !== todayStr) {
      wStreakData.count += 1;
      wStreakData.lastDate = todayStr;
      localStorage.setItem(`workout_streak_${currentUser.email}`, JSON.stringify(wStreakData));
      setWorkoutStreak(wStreakData.count);
    }
  }, [currentUser, workoutTypes]);

  const value = {
    hydration,
    meals,
    streak,
    cheatDays,
    dailyGoal,
    caloriesConsumed,
    workoutTypes,
    steps,
    workoutStreak,
    addWater,
    removeWater,
    addMeal,
    removeMeal,
    toggleWorkoutType,
    completeWorkout,
    setSteps
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
}
