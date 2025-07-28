import React, { useEffect, useState } from 'react'
import { supabase, Video } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import VideoCard from '../components/VideoCard'
import { Play, TrendingUp, Star, Clock, ExternalLink } from 'lucide-react'

const Home: React.FC = () => {
  const { user, profile } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null)
  const paymentUrl = 'https://shop.bkash.com/abraham-shop01334124050/pay/bdt250/nmqCGW'

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setVideos(data || [])
      if (data && data.length > 0) {
        setFeaturedVideo(data[0])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasActiveSubscription = profile?.subscription_status === 'active'

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-white mt-4">কনটেন্ট লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center mb-8">
              <Play className="h-16 w-16 text-green-500 mr-4" />
              <h1 className="text-6xl md:text-8xl font-bold text-white">Delta</h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              আনলিমিটেড মুভি এবং ওয়েব সিরিজ স্ট্রিম করুন। আপনার পরবর্তী বিনোদন অপেক্ষা করছে।
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <a
                href="/auth"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                শুরু করুন
              </a>
              <a
                href="/browse"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                কনটেন্ট ব্রাউজ করুন
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">কেন ডেল্টা বেছে নেবেন?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">সর্বশেষ কনটেন্ট</h3>
                <p className="text-gray-400">আপলোডের সাথে সাথে নতুন মুভি এবং ওয়েব সিরিজে অ্যাক্সেস পান।</p>
              </div>
              <div className="text-center">
                <Star className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">প্রিমিয়াম কোয়ালিটি</h3>
                <p className="text-gray-400">উচ্চ মানের ভিডিও এবং অডিও সহ স্ট্রিমিং উপভোগ করুন।</p>
              </div>
              <div className="text-center">
                <Clock className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">যেকোনো সময় দেখুন</h3>
                <p className="text-gray-400">যেকোনো ডিভাইস থেকে ২৪/৭ আপনার পছন্দের কনটেন্ট স্ট্রিম করুন।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">সাবস্ক্রিপশন প্রয়োজন</h2>
          <p className="text-gray-300 mb-6">
            আপনার সাবস্ক্রিপশন {profile?.subscription_status || 'inactive'}। ডেল্টার প্রিমিয়াম কনটেন্ট দেখতে বিকাশে পেমেন্ট করুন।
          </p>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
          >
            <span>বিকাশে পে করুন</span>
            <ExternalLink className="h-5 w-5" />
          </a>
          <p className="text-gray-500 text-sm mt-4">
            পেমেন্টের পর অ্যাডমিন ২৪ ঘণ্টার মধ্যে আপনার সাবস্ক্রিপশন একটিভ করবেন।
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Featured Video Hero */}
      {featuredVideo && (
        <div className="relative h-96 md:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            {featuredVideo.thumbnail_url ? (
              <img
                src={featuredVideo.thumbnail_url}
                alt={featuredVideo.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {featuredVideo.title}
                </h1>
                {featuredVideo.description && (
                  <p className="text-lg text-gray-300 mb-6 line-clamp-3">
                    {featuredVideo.description}
                  </p>
                )}
                <div className="flex space-x-4">
                  <a
                    href={`/watch/${featuredVideo.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Play className="h-5 w-5" />
                    <span>এখনই দেখুন</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">দেখা চালিয়ে যান</h2>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} hasActiveSubscription={hasActiveSubscription} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">কোনো কনটেন্ট নেই</h3>
            <p className="text-gray-500">নতুন মুভি এবং ওয়েব সিরিজ শীঘ্রই যোগ করা হবে।</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home