import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Video } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import VideoPlayer from '../components/VideoPlayer'
import { ArrowLeft, Lock } from 'lucide-react'

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const hasActiveSubscription = profile?.subscription_status === 'active'

  useEffect(() => {
    if (id) {
      fetchVideo(id)
    }
  }, [id])

  const fetchVideo = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()

      if (error) throw error
      setVideo(data)
    } catch (error: any) {
      setError(error.message || 'Video not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-white mt-4">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Video Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white mr-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">{video.title}</h1>
          </div>

          {/* Subscription Required */}
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Subscription Required</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              This content is available to premium subscribers only. Subscribe now to unlock unlimited access to our entire library.
            </p>
            <a
              href="/subscription"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Subscribe Now
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">{video.title}</h1>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer video={video} autoplay />
        </div>

        {/* Video Information */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4">{video.title}</h2>
              {video.description && (
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  {video.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm">
                {video.year && (
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                    {video.year}
                  </span>
                )}
                {video.genre && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full">
                    {video.genre}
                  </span>
                )}
                {video.duration && (
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                    {Math.floor(video.duration / 60)} minutes
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Watch