import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't completed onboarding, redirect them to onboarding
  // We'll check if they have a 'targetWeight' or similar field to determine this
  if (currentUser && !currentUser.targetWeight && window.location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
  }

  return children;
}
