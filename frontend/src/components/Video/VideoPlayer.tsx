import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Video {
  id: number
  title: string
  description: string
  youtube_id: string
  thumbnail_url: string
  duration: number
  difficulty: string
  category: string
  view_count: number
}

interface Subtitle {
  id: number
  video_id: number
  start_time: number
  end_time: number
  english_text: string
  vietnamese_text: string
}

interface Vocabulary {
  id: number
  video_id: number
  word: string
  definition: string
  example: string
  difficulty: string
}

interface VideoPlayerProps {
  video: Video
  subtitles: Subtitle[]
  vocabulary: Vocabulary[]
  onBack: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, subtitles, vocabulary, onBack }) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null)
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  useEffect(() => {
    // Load YouTube API
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.YT) {
        initializePlayer()
      } else {
        window.onYouTubeIframeAPIReady = initializePlayer
      }
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [video.youtube_id])

  const initializePlayer = () => {
    if (!playerRef.current) return

    new window.YT.Player(playerRef.current, {
      height: '400',
      width: '100%',
      videoId: video.youtube_id,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0
      },
      events: {
        onReady: (event: any) => {
          setPlayer(event.target)
          setDuration(event.target.getDuration())
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
        }
      }
    })
  }

  const togglePlayPause = () => {
    if (!player) return
    
    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  const handleSeek = (time: number) => {
    if (!player) return
    player.seekTo(time, true)
  }

  const handleVolumeChange = (newVolume: number) => {
    if (!player) return
    setVolume(newVolume)
    player.setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (!player) return
    
    if (isMuted) {
      player.unMute()
      setIsMuted(false)
    } else {
      player.mute()
      setIsMuted(true)
    }
  }

  const jumpToSubtitle = (subtitle: Subtitle) => {
    handleSeek(subtitle.start_time)
    setCurrentSubtitle(subtitle)
  }

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
  }

  const getCurrentSubtitle = () => {
    return subtitles.find(sub => 
      currentTime >= sub.start_time && currentTime <= sub.end_time
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        const time = player.getCurrentTime()
        setCurrentTime(time)
        
        const subtitle = getCurrentSubtitle()
        if (subtitle && subtitle !== currentSubtitle) {
          setCurrentSubtitle(subtitle)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [player, currentTime])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Videos
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden">
            <div ref={playerRef} className="w-full"></div>
          </div>

          {/* Video Controls */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <div className="flex items-center space-x-2">
                <button onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-600">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')} / 
                  {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
            <p className="text-gray-600 mb-4">{video.description}</p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {video.difficulty}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {video.category}
              </span>
              <span>{video.view_count} views</span>
            </div>
          </div>
        </div>

        {/* Subtitles Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Subtitles</h3>
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showSubtitles ? 'Hide' : 'Show'}
              </button>
            </div>

            {showSubtitles && (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {subtitles.map((subtitle) => (
                  <div
                    key={subtitle.id}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      currentSubtitle?.id === subtitle.id
                        ? 'bg-blue-100 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => jumpToSubtitle(subtitle)}
                  >
                    <div className="text-sm text-gray-500 mb-1">
                      {Math.floor(subtitle.start_time / 60)}:{(subtitle.start_time % 60).toFixed(0).padStart(2, '0')}
                    </div>
                    <div className="text-sm">
                      {subtitle.english_text.split(' ').map((word, index) => (
                        <span
                          key={index}
                          className="hover:text-blue-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWordClick(word.replace(/[^\w]/g, ''))
                          }}
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </div>
                    {subtitle.vietnamese_text && (
                      <div className="text-sm text-gray-600 mt-1">
                        {subtitle.vietnamese_text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vocabulary Panel */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Vocabulary</h3>
            <div className="space-y-3">
              {vocabulary.map((word) => (
                <div
                  key={word.id}
                  className={`p-3 rounded border ${
                    selectedWord === word.word.toLowerCase()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-blue-600">{word.word}</div>
                  <div className="text-sm text-gray-600 mt-1">{word.definition}</div>
                  {word.example && (
                    <div className="text-sm text-gray-500 mt-1 italic">
                      "{word.example}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer