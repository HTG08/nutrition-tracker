# NutriFlow

## Problem Statement
Many individuals struggle to maintain a consistent healthy lifestyle because tracking nutrition, hydration, and workouts often requires multiple complex apps. This leads to broken streaks, lost motivation, and a poor understanding of daily progress. NutriFlow provides a streamlined, all-in-one digital solution to seamlessly track calories, water intake, daily steps, and workout consistency, ensuring a frictionless health journey.

**Who is the user?**
Health-conscious individuals, fitness beginners, and anyone looking for a visually engaging and simple interface to manage their daily health and wellness goals.

**Why does this problem matter?**
Fragmented health tracking is prone to drop-offs. By unifying diet, hydration, and exercise into a single dynamic dashboard with interactive streak monitoring, users are visually rewarded for their consistency, significantly improving their adherence to a healthy lifestyle.



## Features
- **Dynamic Dashboard:** 
    A real-time overview of daily caloric needs, consumed calories, and remaining targets based on personal body metrics.
- **Smart Workout & Step Tracking:** 
    Check off multiple workout types (Weights, Cardio, Low Intensity) and track daily steps with visual progress rings.
- **Dual Streak System:**
    Independent tracking for both "Food Streaks" (healthy eating days) and "Workout Streaks" to reward consistency.
- **Hydration Monitoring:**
    Interactive quick-add water tracking directly on the dashboard.
- **Personalized Onboarding:**
    Tailored caloric goals calculated based on the user's weight, height, gender, and personal fitness goals (lose, maintain, or gain           weight).
- **Mock & Live Database Modes:**
    Fallback local storage support ensures the app works perfectly even without live Firebase keys, preventing any loading freezes.
- **Responsive & Dynamic Design:**
    Built with glassmorphism, micro-animations, and a premium dark mode aesthetic for a stunning user experience.

---

## Tech Stack
- **Frontend:** React (Functional Components, Hooks, Context API)
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS (Custom Premium Dark Theme)
- **Backend:** Firebase (Auth & Firestore integration ready)
- **Build Tool:** Vite

---

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Add your Firebase config in `src/services/firebase.js`. If you do not add keys, the app will safely default to Local Storage Mock Mode.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure
- `/src/components`: Reusable UI components (Layout, Protected Routes, Stat Cards).
- `/src/pages`: Main application views (Landing, Onboarding, Dashboard, Tracker, Suggestions).
- `/src/context`: Global state management for User Auth (`AuthContext.jsx`) and Daily Stats (`NutritionContext.jsx`).
- `/src/services`: Firebase and mock backend configurations.
- `/src/index.css`: Global CSS containing the custom dark-mode design system.
