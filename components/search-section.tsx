"use client"

import { FilterSection } from "@/components/filter-section"

type SearchSectionProps = {
  onFilterChange: (filters: {
    locationIds: number[]
    categoryIds: number[]
    minNumber?: number
    maxNumber?: number
    isOnline?: boolean
  }) => void
}

export function SearchSection({ onFilterChange }: SearchSectionProps) {
  return (
    <div className="mb-8">
      <FilterSection onFilterChange={onFilterChange} />
    </div>
  )
}
