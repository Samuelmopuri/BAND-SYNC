import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverMusiciansPage from './pages/DiscoverMusiciansPage';
import MusicianProfilePage from './pages/MusicianProfilePage';
import BandsPage from './pages/BandsPage';
import BandDetailsPage from './pages/BandDetailsPage';
import RehearsalsPage from './pages/RehearsalsPage';
import CommunityPage from './pages/CommunityPage';
import CollaborationRequestsPage from './pages/CollaborationRequestsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/discover" element={<DiscoverMusiciansPage />} />
              <Route path="/musicians/:id" element={<MusicianProfilePage />} />
              <Route path="/bands" element={<BandsPage />} />
              <Route path="/bands/:id" element={<BandDetailsPage />} />
              <Route path="/rehearsals" element={<RehearsalsPage />} />
              <Route path="/community" element={<CommunityPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <CollaborationRequestsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
