import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase, Video } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import VideoCard from '../components/VideoCard'
import { Search, Filter, X, ExternalLink } from 'lucide-react'

const Browse: React.FC = () => {
  const { profile } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionContainerRef = useRef<HTMLDivElement>(null)
  const paymentUrl = 'https://shop.bkash.com/abraham-shop01334124050/pay/bdt250/nmqCGW'

  const hasActiveSubscription = profile?.subscription_status === 'active'

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    filterVideos()
    updateSearchSuggestions()
  }, [videos, searchTerm, selectedGenre])

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setVideos(data || [])
      const uniqueGenres = [...new Set(data?.map(video => video.genre).filter(Boolean))] as string[]
      setGenres(uniqueGenres)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterVideos = () => {
    let filtered = videos
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedGenre) {
      filtered = filtered.filter(video => video.genre === selectedGenre)
    }
    setFilteredVideos(filtered)
  }

  const updateSearchSuggestions = useCallback(() => {
    if (!searchTerm) {
      setSearchSuggestions([])
      setIsSearchActive(false)
      return
    }
    const suggestions = [
      ...new Set([
        ...videos.map(video => video.title),
        ...genres,
      ].filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())))
    ].slice(0, 6)
    setSearchSuggestions(suggestions)
    setIsSearchActive(suggestions.length > 0)
    setSelectedSuggestionIndex(-1)
  }, [searchTerm, videos, genres])

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setSearchSuggestions([])
    setIsSearchActive(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedGenre('')
    setSearchSuggestions([])
    setIsSearchActive(false)
    setSelectedSuggestionIndex(-1)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchSuggestions.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : searchSuggestions.length - 1
      )
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(searchSuggestions[selectedSuggestionIndex])
    } else if (e.key === 'Escape') {
      setSearchSuggestions([])
      setIsSearchActive(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionContainerRef.current) {
      const selectedElement = suggestionContainerRef.current.children[selectedSuggestionIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedSuggestionIndex])

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

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">কনটেন্ট ব্রাউজ করুন</h1>
          <p className="text-gray-400 text-lg">মুভি এবং ওয়েব সিরিজ আবিষ্কার করুন</p>
        </div>

        {/* Subscription Prompt for Non-Active Users */}
        {!hasActiveSubscription && (
          <div className="bg-gray-900/80 backdrop-blur-md border border-green-500/20 rounded-xl p-6 mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">সাবস্ক্রিপশন প্রয়োজন</h2>
            <p className="text-gray-300 mb-6">
              সম্পূর্ণ কনটেন্ট অ্যাক্সেস করতে বিকাশে পেমেন্ট করুন। আপনার সাবস্ক্রিপশন ২৪ ঘণ্টার মধ্যে একটিভ হবে।
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
          </div>
        )}

        {/* Search and Filter */}
        <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl rounded-xl p-6 mb-8 border border-green-500/40 shadow-2xl transition-all duration-500 hover:shadow-green-500/10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-green-500/30 to-transparent rounded-lg transition-all duration-500 ${isSearchActive ? 'opacity-100 scale-105' : 'opacity-50 scale-100'}`}></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 h-6 w-6 transition-transform duration-300 group-focus-within:scale-110 group-hover:text-green-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchActive(!!searchTerm)}
                onKeyDown={handleKeyDown}
                placeholder="মুভি বা সিরিজ খুঁজুন..."
                className="relative w-full pl-14 pr-12 py-3 bg-gray-800/40 border border-gray-700/40 rounded-lg text-white placeholder-gray-400/60 focus:outline-none focus:ring-4 focus:ring-green-400/50 focus:bg-gray-800/60 transition-all duration-300 hover:border-green-400/60"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-green-400 hover:scale-125 transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {/* Search Suggestions Overlay */}
              {searchSuggestions.length > 0 && isSearchActive && (
                <div
                  ref={suggestionContainerRef}
                  className="absolute top-full left-0 right-0 mt-3 bg-gray-900/95 backdrop-blur-xl border border-green-500/50 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto transition-all duration-300 animate-fadeIn"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-5 py-3 text-white transition-all duration-200 ${
                        index === selectedSuggestionIndex
                          ? 'bg-green-500/30 text-green-300'
                          : 'hover:bg-green-500/20 hover:text-green-200'
                      }`}
                    >
                      <span className="font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Genre Filter */}
            <div className="relative w-full md:w-64 group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-transparent rounded-lg transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200 h-5 w-5 transition-transform duration-300 group-focus-within:scale-110 group-hover:text-green-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="relative w-full pl-14 pr-10 py-3 bg-gray-800/40 border border-gray-700/40 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-green-400/50 focus:bg-gray-800/60 transition-all duration-300 hover:border-green-400/60 appearance-none"
              >
                <option value="">All</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-200 text-sm font-medium">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'টি ফলাফল' : 'টি ফলাফল'} পাওয়া গেছে
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} hasActiveSubscription={hasActiveSubscription} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">I don't have any money to upgrade database, Plz donate</h3>
            <p className="text-gray-500">
              {searchTerm || selectedGenre
                ? 'আপনার সার্চ বা ফিল্টার পরিবর্তন করে চেষ্টা করুন'
                : 'এই মুহূর্তে কোনো কনটেন্ট নেই'}
            </p>
          </div>
        )}
      </div>

      {/* Overlay Background for Search */}
      {isSearchActive && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 animate-fadeIn"
          onClick={() => {
            setIsSearchActive(false)
            setSearchSuggestions([])
            setSelectedSuggestionIndex(-1)
          }}
        ></div>
      )}
    </div>
  )
}

export default Browse