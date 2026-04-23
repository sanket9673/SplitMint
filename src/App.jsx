import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Components
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupPage from './pages/GroupPage';
import ExpensePage from './pages/ExpensePage';
import HistoryPage from './pages/HistoryPage';
import SettlePage from './pages/SettlePage';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/group/:groupId" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
        <Route path="/group/:groupId/expense/new" element={<ProtectedRoute><ExpensePage /></ProtectedRoute>} />
        <Route path="/group/:groupId/expense/:expenseId" element={<ProtectedRoute><ExpensePage /></ProtectedRoute>} />
        <Route path="/group/:groupId/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/group/:groupId/settle" element={<ProtectedRoute><SettlePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
