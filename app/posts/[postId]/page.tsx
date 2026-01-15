"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Calendar, ArrowLeft } from "lucide-react"

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

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.postId as string

  const [post, setPost] = useState<PostResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // API 호출 (현재는 mock 데이터 사용)
        // const response = await fetch(`http://localhost:8080/api/posts/${postId}`)
        // const data = await response.json()
        // setPost(data)

        // Mock 데이터
        setTimeout(() => {
          setPost({
            postId: Number(postId),
            categoryId: 1,
            locationId: 2,
            title: "토익 스터디원 모집합니다",
            content: `토익 900점 이상을 목표로 하는 스터디원을 모집합니다.

매주 토요일 오전 10시에 스터디를 진행하며, 각자 준비해온 문제를 풀고 오답을 함께 분석합니다.

스터디 구성:
- 1주차: LC Part 1-2 집중 학습
- 2주차: LC Part 3-4 집중 학습  
- 3주차: RC Part 5-6 집중 학습
- 4주차: RC Part 7 집중 학습

준비물:
- 토익 교재 (해커스 토익 Reading/Listening)
- 노트북 또는 태블릿
- 필기구

스터디 규칙:
- 지각 및 결석 시 사전 공지 필수
- 매주 과제 필수 제출
- 스터디 참여도가 낮을 경우 퇴출될 수 있습니다

열정있는 분들의 많은 참여 부탁드립니다!`,
            maxNumber: 6,
            minNumber: 4,
            isActive: true,
            startDate: "2025-02-01",
            endDate: "2025-05-31",
          })
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Failed to fetch post:", error)
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <p className="text-muted-foreground">스터디를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const isFull = !post.isActive

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로 돌아가기
      </Button>

      <Card>
        <CardHeader className="space-y-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getCategoryName(post.categoryId)}</Badge>
            <Badge variant={isFull ? "destructive" : "secondary"}>{isFull ? "모집완료" : "모집중"}</Badge>
          </div>

          <h1 className="text-balance text-3xl font-bold leading-tight text-card-foreground">{post.title}</h1>

          <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">{getLocationName(post.locationId)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                {post.minNumber}~{post.maxNumber}명
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                {post.startDate} ~ {post.endDate}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-card-foreground">{post.content}</div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button disabled={isFull}>{isFull ? "모집이 완료되었습니다" : "신청하기"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 임시 카테고리 이름 매핑
function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: "토익",
    2: "토플",
    3: "프로그래밍",
    4: "자격증",
    5: "취업",
    6: "공무원",
    7: "어학",
    8: "기타",
  }
  return categories[categoryId] || `카테고리 ${categoryId}`
}

// 임시 지역 이름 매핑
function getLocationName(locationId: number): string {
  const locations: Record<number, string> = {
    1: "서울",
    2: "경기",
    3: "인천",
    4: "부산",
    5: "대구",
    6: "광주",
    7: "대전",
    8: "울산",
    9: "세종",
    10: "온라인",
  }
  return locations[locationId] || `지역 ${locationId}`
}
