import React from 'react'
import { Video } from '../lib/supabase'

interface VideoPlayerProps {
  video: Video
  autoplay?: boolean
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, autoplay = false }) => {
  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-full"
        controls
        autoPlay={autoplay}
        preload="metadata"
        poster={video.thumbnail_url}
      >
        <source src={video.file_url} type="video/mp4" />
        <source src={video.file_url} type="video/webm" />
        <source src={video.file_url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer