"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen } from "lucide-react"

type Gender = "MAN" | "WOMAN"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    userLoginId: "",
    memberName: "",
    memberEmail: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    memberBirth: "",
    memberGender: "" as Gender | "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validatePassword = (password: string) => {
    if (password.length < 8 || password.length > 20) {
      return "비밀번호는 8-20자 사이여야 합니다."
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).+$/
    if (!passwordRegex.test(password)) {
      return "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
    }
    return ""
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "올바른 이메일 형식이 아닙니다."
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.userLoginId) newErrors.userLoginId = "아이디를 입력해주세요."
    if (!formData.memberName) newErrors.memberName = "이름을 입력해주세요."
    if (!formData.memberEmail) {
      newErrors.memberEmail = "이메일을 입력해주세요."
    } else {
      const emailError = validateEmail(formData.memberEmail)
      if (emailError) newErrors.memberEmail = emailError
    }
    if (!formData.nickname) newErrors.nickname = "닉네임을 입력해주세요."
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요."
    } else {
      const passwordError = validatePassword(formData.password)
      if (passwordError) newErrors.password = passwordError
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요."
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다."
    }
    if (!formData.memberBirth) newErrors.memberBirth = "생년월일을 입력해주세요."
    if (!formData.memberGender) newErrors.memberGender = "성별을 선택해주세요."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLoginId: formData.userLoginId,
          memberName: formData.memberName,
          memberEmail: formData.memberEmail,
          nickname: formData.nickname,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          memberBirth: formData.memberBirth,
          memberGender: formData.memberGender,
        }),
      })

      if (response.ok) {
        alert("회원가입이 완료되었습니다!")
        window.location.href = "/login"
      } else {
        const errorData = await response.json()
        alert(errorData.message || "회원가입에 실패했습니다.")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">스터디모여</h1>
          </div>
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
          <CardDescription className="text-center">새로운 계정을 만들어 스터디를 시작하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userLoginId">아이디</Label>
              <Input
                id="userLoginId"
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.userLoginId}
                onChange={(e) => setFormData({ ...formData, userLoginId: e.target.value })}
              />
              {errors.userLoginId && <p className="text-sm text-destructive">{errors.userLoginId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberName">이름</Label>
              <Input
                id="memberName"
                type="text"
                placeholder="홍길동"
                value={formData.memberName}
                onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
              />
              {errors.memberName && <p className="text-sm text-destructive">{errors.memberName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberEmail">이메일</Label>
              <Input
                id="memberEmail"
                type="email"
                placeholder="example@email.com"
                value={formData.memberEmail}
                onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
              />
              {errors.memberEmail && <p className="text-sm text-destructive">{errors.memberEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              />
              {errors.nickname && <p className="text-sm text-destructive">{errors.nickname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">8-20자, 영문/숫자/특수문자 포함</p>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberBirth">생년월일</Label>
              <Input
                id="memberBirth"
                type="date"
                value={formData.memberBirth}
                onChange={(e) => setFormData({ ...formData, memberBirth: e.target.value })}
              />
              {errors.memberBirth && <p className="text-sm text-destructive">{errors.memberBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberGender">성별</Label>
              <Select
                value={formData.memberGender}
                onValueChange={(value: Gender) => setFormData({ ...formData, memberGender: value })}
              >
                <SelectTrigger id="memberGender" className="w-full">
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAN">남성</SelectItem>
                  <SelectItem value="WOMAN">여성</SelectItem>
                </SelectContent>
              </Select>
              {errors.memberGender && <p className="text-sm text-destructive">{errors.memberGender}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "가입 중..." : "회원가입"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              로그인
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
