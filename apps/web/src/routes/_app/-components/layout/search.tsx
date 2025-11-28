import * as React from 'react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { cn } from '@workspace/ui/lib/utils'

const Search = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="search" className={cn('', className)} {...props}>
      <div className="flex flex-wrap items-center gap-2">
        <Select>
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Select a previous search" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Search by Podcast / Topic" className="w-full min-w-32 sm:flex-1" />
        <div className="flex w-full flex-1 items-center gap-2">
          <Button className="flex-1">Search</Button>
          <Button variant="destructive" className="flex-1">
            Clear History
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Search }
