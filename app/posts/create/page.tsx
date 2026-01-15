"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { locationData } from "@/lib/location-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: 1, name: "언어 학습" },
  { id: 2, name: "프로그래밍/IT" },
  { id: 3, name: "취업/커리어" },
  { id: 4, name: "자격증 준비" },
  { id: 5, name: "프로젝트/사이드" },
  { id: 6, name: "독서/책 읽기" },
  { id: 7, name: "학문/전문" },
  { id: 8, name: "취미/기타" },
]

export default function CreatePostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    categoryId: "",
    locationId: "",
    title: "",
    content: "",
    maxNumber: "",
    minNumber: "",
    isOnline: "",
    startDate: "",
    endDate: "",
  })

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedDistrict("")
    setFormData((prev) => ({ ...prev, locationId: "" }))
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setFormData((prev) => ({ ...prev, locationId: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.categoryId) newErrors.categoryId = "스터디 종류를 선택하세요"
    if (!formData.locationId) newErrors.locationId = "지역을 선택하세요"
    if (!formData.title.trim()) newErrors.title = "제목을 입력하세요"
    if (!formData.content.trim()) newErrors.content = "내용을 입력하세요"
    if (!formData.minNumber || Number.parseInt(formData.minNumber) < 1) newErrors.minNumber = "최소 인원을 입력하세요"
    if (!formData.maxNumber || Number.parseInt(formData.maxNumber) < 1) newErrors.maxNumber = "최대 인원을 입력하세요"
    if (
      formData.minNumber &&
      formData.maxNumber &&
      Number.parseInt(formData.minNumber) > Number.parseInt(formData.maxNumber)
    ) {
      newErrors.maxNumber = "최대 인원은 최소 인원보다 커야 합니다"
    }
    if (formData.isOnline === "") newErrors.isOnline = "온라인/오프라인을 선택하세요"
    if (!formData.startDate) newErrors.startDate = "시작일을 선택하세요"
    if (!formData.endDate) newErrors.endDate = "종료일을 선택하세요"
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "종료일은 시작일보다 이후여야 합니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const requestBody = {
        categoryId: Number.parseInt(formData.categoryId),
        locationId: Number.parseInt(formData.locationId),
        title: formData.title,
        content: formData.content,
        maxNumber: Number.parseInt(formData.maxNumber),
        minNumber: Number.parseInt(formData.minNumber),
        isOnline: formData.isOnline === "true",
        startDate: formData.startDate,
        endDate: formData.endDate,
      }

      console.log("[v0] Creating post with data:", requestBody)

      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "스터디 생성에 실패했습니다")
      }

      const result = await response.json()
      console.log("[v0] Post created successfully:", result)

      const postId = result.postId
      router.push(`/posts/${postId}`)
    } catch (error) {
      console.error("[v0] Create post error:", error)
      alert(error instanceof Error ? error.message : "스터디 생성 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  const districts = selectedProvince
    ? locationData.find((p) => p.id.toString() === selectedProvince)?.districts || []
    : []

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로 돌아가기
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">스터디 만들기</CardTitle>
          <CardDescription>새로운 스터디를 생성하고 멤버를 모집하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">
                제목 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="스터디 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content">
                내용 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="스터디에 대한 설명을 입력하세요"
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>

            {/* 스터디 종류 */}
            <div className="space-y-2">
              <Label htmlFor="category">
                스터디 종류 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
            </div>

            {/* 지역 선택 */}
            <div className="space-y-2">
              <Label>
                지역 <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="시/도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationData.map((province) => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedProvince}>
                    <SelectTrigger>
                      <SelectValue placeholder="구/군 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.locationId && <p className="text-sm text-destructive">{errors.locationId}</p>}
            </div>

            {/* 인원 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minNumber">
                  최소 인원 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="minNumber"
                  type="number"
                  min="1"
                  placeholder="2"
                  value={formData.minNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, minNumber: e.target.value }))}
                />
                {errors.minNumber && <p className="text-sm text-destructive">{errors.minNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxNumber">
                  최대 인원 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="maxNumber"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.maxNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxNumber: e.target.value }))}
                />
                {errors.maxNumber && <p className="text-sm text-destructive">{errors.maxNumber}</p>}
              </div>
            </div>

            {/* 온라인/오프라인 */}
            <div className="space-y-2">
              <Label htmlFor="isOnline">
                진행 방식 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.isOnline}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isOnline: value }))}
              >
                <SelectTrigger id="isOnline">
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">오프라인</SelectItem>
                  <SelectItem value="true">온라인</SelectItem>
                </SelectContent>
              </Select>
              {errors.isOnline && <p className="text-sm text-destructive">{errors.isOnline}</p>}
            </div>

            {/* 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  시작일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  종료일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "생성 중..." : "스터디 만들기"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
