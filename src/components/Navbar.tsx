import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Play, User, Upload, LogOut } from 'lucide-react'

const Navbar: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Play className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-white">Delta</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/browse') 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Browse
                </Link>
                <Link
                  to="/subscription"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/subscription') 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Subscription
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Upload className="inline-block w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user.email}</span>
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-300 hover:text-white flex items-center space-x-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:block">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar