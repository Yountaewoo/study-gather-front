"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { identifier?: string; password?: string } = {}
    if (!formData.identifier) {
      newErrors.identifier = "아이디를 입력하세요."
    }
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력하세요."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("login-status", "true")
        alert("로그인 성공!")
        router.push("/")
        window.location.href = "/"
      } else {
        const errorData = await response.json()
        alert(errorData.message || "로그인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("서버와의 연결에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">스터디모여</h1>
          </div>
          <CardTitle className="text-2xl text-center">로그인</CardTitle>
          <CardDescription className="text-center">계정에 로그인하여 스터디를 시작하세요</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">아이디</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.identifier}
                onChange={(e) => {
                  setFormData({ ...formData, identifier: e.target.value })
                  setErrors({ ...errors, identifier: undefined })
                }}
                className={errors.identifier ? "border-red-500" : ""}
              />
              {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  setErrors({ ...errors, password: undefined })
                }}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              회원가입
            </Link>
          </div>
          <Link href="/" className="text-sm text-center text-muted-foreground hover:text-foreground">
            메인으로 돌아가기
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
