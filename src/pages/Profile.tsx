import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Calendar, Shield, CreditCard } from 'lucide-react'

const Profile: React.FC = () => {
  const { user, profile, isAdmin } = useAuth()

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not Logged In</h2>
          <p className="text-gray-400">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account settings and subscription</p>
        </div>

        {/* Profile Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Details */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <p className="text-white">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Account Type
                </label>
                <div className="flex items-center">
                  <p className="text-white mr-2">
                    {isAdmin ? 'Administrator' : 'Standard User'}
                  </p>
                  {isAdmin && <Shield className="h-4 w-4 text-green-500" />}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Member Since
                </label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-white">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Subscription Status
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Current Plan
                </label>
                <div className="flex items-center">
                  <span className={`font-semibold capitalize ${
                    profile.subscription_status === 'active' 
                      ? 'text-green-500' 
                      : profile.subscription_status === 'expired'
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}>
                    {profile.subscription_status === 'active' ? 'Premium' : 
                     profile.subscription_status === 'expired' ? 'Expired' : 'No Active Plan'}
                  </span>
                </div>
              </div>
              
              {profile.subscription_expires_at && profile.subscription_status === 'active' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Expires On
                  </label>
                  <p className="text-white">
                    {new Date(profile.subscription_expires_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                {profile.subscription_status !== 'active' ? (
                  <a
                    href="/subscription"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-block"
                  >
                    Subscribe Now
                  </a>
                ) : (
                  <div className="text-green-500 text-sm">
                    ✓ You have full access to all premium content
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Account Actions</h2>
          <div className="space-y-4">
            {profile.subscription_status !== 'active' && (
              <a
                href="/subscription"
                className="block w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Upgrade to Premium
              </a>
            )}
            
            <div className="text-gray-400 text-sm">
              <p>Need help? Contact our support team for assistance with your account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile