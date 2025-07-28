import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Video } from '../lib/supabase'
import { Upload, X, Plus, Trash2, Edit } from 'lucide-react'

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    genre: '',
    year: new Date().getFullYear(),
    file: null as File | null,
    thumbnail: null as File | null
  })

  useEffect(() => {
    if (isAdmin) {
      fetchVideos()
    }
  }, [isAdmin])

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const handleFileUpload = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadData.file || !user) return

    setLoading(true)
    try {
      // Upload video file
      const videoUrl = await handleFileUpload(uploadData.file, 'videos')
      
      // Upload thumbnail if provided
      let thumbnailUrl = null
      if (uploadData.thumbnail) {
        thumbnailUrl = await handleFileUpload(uploadData.thumbnail, 'thumbnails')
      }

      // Save video metadata
      const { error } = await supabase
        .from('videos')
        .insert({
          title: uploadData.title,
          description: uploadData.description,
          genre: uploadData.genre,
          year: uploadData.year,
          file_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          admin_id: user.id
        })

      if (error) throw error

      // Reset form
      setUploadData({
        title: '',
        description: '',
        genre: '',
        year: new Date().getFullYear(),
        file: null,
        thumbnail: null
      })
      setShowUploadForm(false)
      fetchVideos()
      alert('Video uploaded successfully!')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)

      if (error) throw error
      fetchVideos()
      alert('Video deleted successfully!')
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(`Delete failed: ${error.message}`)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have admin privileges.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Video</span>
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Upload New Video</h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={uploadData.genre}
                    onChange={(e) => setUploadData({ ...uploadData, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Action, Drama, Comedy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter video description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={uploadData.year}
                  onChange={(e) => setUploadData({ ...uploadData, year: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video File * (Max 10GB)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadData({ ...uploadData, thumbnail: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-gray-500 text-sm mt-1">
                  If no thumbnail is provided, one will be generated automatically
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Video
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Videos List */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Uploaded Videos ({videos.length})</h2>
          
          {videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {video.thumbnail_url && (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-white font-semibold">{video.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {video.genre} • {video.year} • {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Delete video"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Videos Uploaded</h3>
              <p className="text-gray-500">Start by uploading your first video.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin