"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { getProvinces, getDistricts } from "@/lib/location-data"

type Category = {
  id: number
  name: string
}

type FilterSectionProps = {
  onFilterChange: (filters: {
    locationIds: number[]
    categoryIds: number[]
    minNumber?: number
    maxNumber?: number
    isOnline?: boolean
  }) => void
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "언어 학습" },
  { id: 2, name: "프로그래밍/IT" },
  { id: 3, name: "취업/커리어" },
  { id: 4, name: "자격증 준비" },
  { id: 5, name: "프로젝트/사이드" },
  { id: 6, name: "독서/책 읽기" },
  { id: 7, name: "학문/전문" },
  { id: 8, name: "취미/기타" },
]

export function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null)
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string>("")
  const [minSize, setMinSize] = useState<string>("")
  const [maxSize, setMaxSize] = useState<string>("")
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  const categories = MOCK_CATEGORIES
  const provinces = getProvinces()
  const districts = selectedProvinceId ? getDistricts(selectedProvinceId) : []

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvinceId(provinceId ? Number(provinceId) : null)
    setSelectedDistrictId(null)
  }

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId ? Number(districtId) : null)
  }

  const clearFilters = () => {
    setSelectedProvinceId(null)
    setSelectedDistrictId(null)
    setSelectedType("")
    setMinSize("")
    setMaxSize("")
    setIsOnline(null)
    onFilterChange({
      locationIds: [],
      categoryIds: [],
      minNumber: undefined,
      maxNumber: undefined,
      isOnline: undefined,
    })
  }

  const applyFilters = () => {
    const locationIds: number[] = []
    const categoryIds: number[] = []

    if (selectedDistrictId) {
      locationIds.push(selectedDistrictId)
    } else if (selectedProvinceId) {
      locationIds.push(selectedProvinceId)
    }

    if (selectedType && selectedType !== "all") {
      const category = categories.find((c) => c.name === selectedType)
      if (category) {
        categoryIds.push(category.id)
      }
    }

    onFilterChange({
      locationIds,
      categoryIds,
      minNumber: minSize ? Number.parseInt(minSize) : undefined,
      maxNumber: maxSize ? Number.parseInt(maxSize) : undefined,
      isOnline: isOnline ?? undefined,
    })
  }

  const hasActiveFilters =
    selectedProvinceId || selectedDistrictId || selectedType || minSize || maxSize || isOnline !== null

  const getLocationDisplayName = () => {
    if (!selectedProvinceId) return ""
    const province = provinces.find((p) => p.id === selectedProvinceId)
    if (!selectedDistrictId) return province?.name || ""
    const district = districts.find((d) => d.id === selectedDistrictId)
    return `${province?.name} > ${district?.name}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">필터</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            초기화
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">시/도</label>
          <Select value={selectedProvinceId?.toString() || "all"} onValueChange={handleProvinceChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id.toString()}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">구/군</label>
          <Select
            value={selectedDistrictId?.toString() || "all"}
            onValueChange={handleDistrictChange}
            disabled={!selectedProvinceId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">스터디 종류</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="전체 종류" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 종류</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">최소 인원</label>
          <Input
            type="number"
            min="0"
            placeholder="최소 인원 입력"
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">최대 인원</label>
          <Input
            type="number"
            min="0"
            placeholder="최대 인원 입력"
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">진행 방식</label>
          <div className="flex gap-2">
            <Button
              variant={isOnline === false ? "default" : "outline"}
              size="sm"
              onClick={() => setIsOnline(isOnline === false ? null : false)}
              className="flex-1"
            >
              대면
            </Button>
            <Button
              variant={isOnline === true ? "default" : "outline"}
              size="sm"
              onClick={() => setIsOnline(isOnline === true ? null : true)}
              className="flex-1"
            >
              비대면
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={applyFilters} size="lg" className="w-full sm:w-auto">
          검색
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {(selectedProvinceId || selectedDistrictId) && (
            <Badge variant="secondary" className="gap-1">
              {getLocationDisplayName()}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedProvinceId(null)
                  setSelectedDistrictId(null)
                }}
              />
            </Badge>
          )}
          {selectedType && selectedType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {selectedType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedType("")} />
            </Badge>
          )}
          {(minSize || maxSize) && (
            <Badge variant="secondary" className="gap-1">
              {minSize ? `${minSize}명` : "제한없음"} ~ {maxSize ? `${maxSize}명` : "제한없음"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setMinSize("")
                  setMaxSize("")
                }}
              />
            </Badge>
          )}
          {isOnline !== null && (
            <Badge variant="secondary" className="gap-1">
              {isOnline ? "비대면" : "대면"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setIsOnline(null)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
