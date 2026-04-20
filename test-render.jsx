import React from 'react';
import { renderToString } from 'react-dom/server';
import Dashboard from './src/pages/Dashboard.jsx';
import { AuthProvider } from './src/context/AuthContext.jsx';
import { NutritionProvider } from './src/context/NutritionContext.jsx';
import { MemoryRouter } from 'react-router-dom';

try {
  const html = renderToString(
    <MemoryRouter>
      <AuthProvider>
        <NutritionProvider>
          <Dashboard />
        </NutritionProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  console.log("RENDER SUCCESS!");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
