import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NutritionProvider } from './context/NutritionContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Suggestions from './pages/Suggestions';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <AuthProvider>
      <NutritionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/suggestions" element={<Suggestions />} />
            </Route>
            
          </Routes>
        </Router>
      </NutritionProvider>
    </AuthProvider>
  );
}

export default App;
