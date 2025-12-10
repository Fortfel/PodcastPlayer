import type { Episode } from '@/providers/podcast-player-store-provider'

const QUEUE_STORAGE_KEY = 'podcastplayer-queue'
const PLAYER_STORAGE_KEY = 'podcastplayer-player'

export type PlayerState = {
  episode: Episode | null
  currentTime: number
}

export const loadQueueFromStorage = (): Array<Episode> => {
  try {
    const saved = localStorage.getItem(QUEUE_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Array<Episode>) : []
  } catch (error) {
    console.error('Failed to load queue from localStorage:', error)
    return []
  }
}

export const saveQueueToStorage = (queue: Array<Episode>) => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.error('Failed to save queue to localStorage:', error)
  }
}

export const loadPlayerFromStorage = (): PlayerState => {
  try {
    const saved = localStorage.getItem(PLAYER_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as PlayerState) : { episode: null, currentTime: 0 }
  } catch (error) {
    console.error('Failed to load player state from localStorage:', error)
    return { episode: null, currentTime: 0 }
  }
}

export const savePlayerToStorage = (state: PlayerState) => {
  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save player state to localStorage:', error)
  }
}
