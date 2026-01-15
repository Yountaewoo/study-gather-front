"use client"

import { StudyCard } from "@/components/study-card"

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

type StudyListProps = {
  studies: PostResponse[]
  isLoading?: boolean
}

export function StudyList({ studies, isLoading }: StudyListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">진행 중인 스터디</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">스터디를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          진행 중인 스터디 <span className="text-muted-foreground">({studies.length})</span>
        </h2>
      </div>

      {studies.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">조건에 맞는 스터디가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <StudyCard key={study.postId} study={study} />
          ))}
        </div>
      )}
    </div>
  )
}
