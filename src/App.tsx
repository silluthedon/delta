import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Browse from './pages/Browse'
import Watch from './pages/Watch'
import Subscription from './pages/Subscription'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/auth" />
}

const AppContent: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" /> : <Auth />} 
        />
        <Route 
          path="/browse" 
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/watch/:id" 
          element={
            <ProtectedRoute>
              <Watch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App