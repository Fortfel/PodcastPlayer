import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'

import { useTRPC } from '@workspace/api/client'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { cn } from '@workspace/ui/lib/utils'

import { usePodcastPlayerStore } from '@/hooks/use-podcast-player-store'

interface SearchProps extends React.ComponentProps<'div'> {
  storageKey?: string
  maxHistoryItems?: number
}

const Search = ({
  className,
  storageKey = 'podcastplayer-search-history',
  maxHistoryItems = 10,
  ...props
}: SearchProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { store, setIsSubmitting, setPodcasts, setErrorMessage, clearErrorMessage, setActiveView } =
    usePodcastPlayerStore()
  const isSubmitting = useStore(store, (state) => state.isSubmitting)

  const [searchValue, setSearchValue] = React.useState('')
  const [searchHistory, setSearchHistory] = React.useState<Array<string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? (JSON.parse(saved) as Array<string>) : []
    } catch (error) {
      console.error('Failed to load search history:', error)
      return []
    }
  })

  // Save history to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(searchHistory))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }, [searchHistory, storageKey])

  const handleSearch = async () => {
    const term = searchValue.trim()
    if (!term) return

    setIsSubmitting(true)
    clearErrorMessage()

    try {
      const result = await queryClient.fetchQuery(trpc.podcastIndex.searchPodcastByTerm.queryOptions({ term }))

      // Remove duplicates and podcasts with episodes = 0
      const titles = new Set<string>()
      const filteredFeeds = result.feeds.filter((p) => {
        if (p.episodeCount === 0 || titles.has(p.title)) return false
        titles.add(p.title)
        return true
      })

      const uniquePodcasts = {
        ...result,
        feeds: filteredFeeds,
      }

      setPodcasts(uniquePodcasts)
      setActiveView('podcast')

      // Avoid duplicates, add to beginning, and limit history size
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item !== term)
        const newHistory = [term, ...filtered]
        return newHistory.slice(0, maxHistoryItems)
      })
    } catch (error) {
      console.error('Search failed:', error)
      setErrorMessage('Search failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearHistory = () => {
    setSearchHistory([])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleSearch()
    }
  }

  return (
    <div data-slot="search" className={cn('', className)} {...props}>
      <div className="flex flex-wrap items-center gap-2">
        <Select value="" onValueChange={setSearchValue}>
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Select a previous search" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectGroup>
              {searchHistory.length === 0 ? (
                <SelectItem value="no-history" disabled>
                  No search history
                </SelectItem>
              ) : (
                searchHistory.map((item, index) => (
                  <SelectItem key={`${item}-${index.toString()}`} value={item}>
                    {item}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search by Podcast / Topic"
          className="w-full min-w-32 sm:flex-1"
        />
        <div className="flex w-full flex-1 items-center gap-2">
          <Button className="flex-1" onClick={() => void handleSearch()} disabled={!searchValue.trim() || isSubmitting}>
            {isSubmitting ? 'Searching...' : 'Search'}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleClearHistory}
            disabled={searchHistory.length === 0 || isSubmitting}
          >
            Clear History
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Search }
