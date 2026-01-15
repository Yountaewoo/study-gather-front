import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Calendar } from "lucide-react"
import Link from "next/link"

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

export function StudyCard({ study }: { study: PostResponse }) {
  const isFull = !study.isActive

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="shrink-0">
            카테고리 {study.categoryId}
          </Badge>
          <Badge variant={isFull ? "destructive" : "secondary"} className="shrink-0">
            {isFull ? "모집완료" : "모집중"}
          </Badge>
        </div>
        <h3 className="line-clamp-2 text-balance text-lg font-semibold leading-tight text-card-foreground">
          {study.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="line-clamp-3 text-pretty text-sm leading-relaxed text-muted-foreground">{study.content}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>지역 {study.locationId}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>
              {study.minNumber}~{study.maxNumber}명
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {study.startDate} ~ {study.endDate}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end border-t border-border pt-4">
        <Link href={`/posts/${study.postId}`}>
          <Button size="sm" disabled={isFull}>
            {isFull ? "모집완료" : "자세히 보기"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
