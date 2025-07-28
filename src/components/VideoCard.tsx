import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import { Video } from '../lib/supabase'

interface VideoCardProps {
  video: Video
  hasActiveSubscription: boolean
}

const VideoCard: React.FC<VideoCardProps> = ({ video, hasActiveSubscription }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}ঘণ্টা ${minutes}মিনিট` : `${minutes}মিনিট`
  }

  // Non-subscribers only see the thumbnail
  if (!hasActiveSubscription) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300">
        <div className="relative aspect-video bg-gray-800">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">কোনো থাম্বনেইল নেই</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Subscribers see full video details
  return (
    <Link to={`/watch/${video.id}`} className="group">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-800">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-600" />
            </div>
          )}
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-green-400 transition-colors">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
              {video.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            {video.year && (
              <span className="text-gray-500 text-sm">{video.year}</span>
            )}
            {video.genre && (
              <span className="text-green-500 text-sm font-medium">{video.genre}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard