import * as React from 'react'
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from '@tabler/icons-react'
import { useStore } from '@tanstack/react-store'

import { Progress } from '@workspace/ui/components/progress'
import { cn } from '@workspace/ui/lib/utils'

import { usePodcastPlayerStore } from '@/hooks/use-podcast-player-store'

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const Player = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const audioRef = React.useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

  const { store } = usePodcastPlayerStore()
  const currentlyPlaying = useStore(store, (state) => state.currentlyPlaying)
  const queue = useStore(store, (state) => state.queue)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentlyPlaying) {
      audio.pause()
      audio.src = ''
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      return
    }

    audio.src = currentlyPlaying.enclosureUrl
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    void audio.play()
    setIsPlaying(true)
  }, [currentlyPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    const [next, ...rest] = queue
    if (next) {
      store.setState((s) => ({ ...s, currentlyPlaying: next, queue: rest }))
    } else {
      store.setState((s) => ({ ...s, currentlyPlaying: null }))
    }
  }

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentlyPlaying) {
      const [next, ...rest] = queue
      if (next) {
        store.setState((s) => ({ ...s, currentlyPlaying: next, queue: rest }))
      }
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      void audio.play()
      setIsPlaying(true)
    }
  }

  const handleSkipForward = () => {
    if (!audioRef.current || !duration) return
    audioRef.current.currentTime += 15
  }

  const handleSkipBackward = () => {
    if (!audioRef.current || !duration) return
    audioRef.current.currentTime -= 15
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div
      data-slot="player"
      className={cn('bg-muted rounded-lg [&>div>div:first-child]:flex-col', className)}
      {...props}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex h-full flex-col items-center gap-1 p-4">
        <div className="flex items-center gap-1">
          <img
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            src={currentlyPlaying?.image || currentlyPlaying?.feedImage || '/default-podcast.png'}
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            alt={currentlyPlaying?.title || 'No episode selected'}
            className="w-50 -mt-20 mb-10 rounded-full object-cover shadow-[0_15px_30px_5px_rgba(0,0,0,0.3)]"
            onError={(e) => {
              e.currentTarget.src = '/default-podcast.png'
            }}
          />
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            <h2 className="line-clamp-2 text-xl font-semibold">{currentlyPlaying?.title || 'No episode playing'}</h2>
            <p className="text-muted-foreground text-sm">
              {currentlyPlaying
                ? new Date(currentlyPlaying.datePublished * 1000).toLocaleDateString()
                : 'Select an episode to play'}
            </p>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col items-center">
          <div className="text-muted-foreground flex w-full justify-between px-2 text-sm">
            <p>{formatTime(currentTime)}</p>
            <p>{formatTime(duration)}</p>
          </div>
          <div // eslint-disable-line jsx-a11y/click-events-have-key-events
            className="mb-4 w-[96%] cursor-pointer"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Seek"
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={duration}
            tabIndex={0}
          >
            <Progress value={progress} />
          </div>
          <div className="text-foreground/80 mb-4 flex items-center gap-5">
            <button
              type="button"
              onClick={handleSkipBackward}
              className="hover:text-foreground cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous track"
            >
              <IconPlayerTrackPrevFilled size="34" />
            </button>
            <button
              type="button"
              onClick={handlePlayPause}
              className="hover:text-foreground cursor-pointer transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <IconPlayerPauseFilled size="46" /> : <IconPlayerPlayFilled size="46" />}
            </button>
            <button
              type="button"
              onClick={handleSkipForward}
              className="hover:text-foreground cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next track"
            >
              <IconPlayerTrackNextFilled size="34" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Player }
