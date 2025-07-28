import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Check, Star, Zap, Shield, ExternalLink } from 'lucide-react'

const Subscription: React.FC = () => {
  const { profile } = useAuth()

  const paymentUrl = 'https://shop.bkash.com/abraham-shop01334124050/pay/bdt250/nmqCGW'

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited access to premium movies and web series with Delta streaming
          </p>
        </div>

        {/* Current Status */}
        {profile && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Current Status</h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Subscription:</span>
              <span className={`font-semibold capitalize ${
                profile.subscription_status === 'active' 
                  ? 'text-green-500' 
                  : profile.subscription_status === 'inactive' || profile.subscription_status === 'expired'
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}>
                {profile.subscription_status}
              </span>
            </div>
            {profile.subscription_expires_at && profile.subscription_status === 'active' && (
              <p className="text-gray-400 text-sm mt-1">
                Expires: {new Date(profile.subscription_expires_at).toLocaleDateString()}
              </p>
            )}
            {profile.subscription_status !== 'active' && (
              <p className="text-gray-400 text-sm mt-2">
                Please complete payment via bKash. Admin will activate your subscription within 24 hours.
              </p>
            )}
          </div>
        )}

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-green-500/20">
          {/* Popular Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Most Popular
            </span>
          </div>

          {/* Plan Details */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">Premium Plan</h3>
            <div className="flex items-center justify-center mb-4">
              <span className="text-5xl font-bold text-green-500">৳250</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <p className="text-gray-400">Full access to Delta's content library</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-300">Unlimited movies and web series</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-300">HD and Full HD streaming quality</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-300">Ad-free viewing experience</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-300">Watch on any device</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-300">New content added regularly</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-300">24/7 customer support</span>
            </div>
          </div>

          {/* Payment Button */}
          <div className="space-y-4">
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <span>Pay with bKash</span>
              <ExternalLink className="h-5 w-5" />
            </a>
            <p className="text-gray-500 text-sm text-center">
              After payment, the admin will activate your subscription within 24 hours.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                How do I activate my subscription after payment?
              </h3>
              <p className="text-gray-400">
                After completing the payment through bKash, the admin will manually verify and activate your subscription within 24 hours. You'll receive a confirmation once activated.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. Contact our support team for assistance with cancellation.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What devices can I watch on?
              </h3>
              <p className="text-gray-400">
                You can watch Delta on any device with a web browser - computers, tablets, smartphones, and smart TVs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscription