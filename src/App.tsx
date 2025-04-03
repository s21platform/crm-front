import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Login from './pages/Login';
import OptionHub from './pages/OptionHub';
import Staff from './pages/Staff';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/optionhub" element={<OptionHub />} />
                    <Route path="/projects" element={<div className="p-4 bg-blue-100 rounded">Страница проектов в разработке</div>} />
                    <Route path="/tasks" element={<div className="p-4 bg-green-100 rounded">Страница задач в разработке</div>} />
                    <Route path="/calendar" element={<div className="p-4 bg-yellow-100 rounded">Страница календаря в разработке</div>} />
                    <Route path="/settings" element={<div className="p-4 bg-gray-100 rounded">Страница настроек в разработке</div>} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
