"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SearchSection } from "@/components/search-section"
import { StudyList } from "@/components/study-list"

type PostResponse = {
  postId: number
  categoryId: number
  locationId: number
  title: string
  content: string
  maxNumber: number
  minNumber: number
  isActive: boolean
  startDate: string
  endDate: string
}

export default function HomePage() {
  const [studies, setStudies] = useState<PostResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStudies({
      locationIds: [],
      categoryIds: [],
    })
  }, [])

  const fetchStudies = async (filters: {
    locationIds: number[]
    categoryIds: number[]
    minNumber?: number
    maxNumber?: number
    isOnline?: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()

      filters.locationIds.forEach((id) => params.append("locationIds", id.toString()))
      filters.categoryIds.forEach((id) => params.append("categoryIds", id.toString()))

      if (filters.minNumber !== undefined) {
        params.append("minNumber", filters.minNumber.toString())
      }
      if (filters.maxNumber !== undefined) {
        params.append("maxNumber", filters.maxNumber.toString())
      }
      if (filters.isOnline !== undefined) {
        params.append("isOnline", filters.isOnline.toString())
      }

      const response = await fetch(`http://localhost:8080/api/posts/filter?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setStudies(data.postResponseList || [])
        setError(null)
      } else {
        setStudies([])
        setError("스터디 목록을 불러오는데 실패했습니다.")
      }
    } catch (error) {
      setStudies([])
      setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (filters: {
    locationIds: number[]
    categoryIds: number[]
    minNumber?: number
    maxNumber?: number
    isOnline?: boolean
  }) => {
    fetchStudies(filters)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchSection onFilterChange={handleFilterChange} />
        <div className="mt-8">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-center">{error}</p>
            </div>
          )}
          <StudyList studies={studies} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}
