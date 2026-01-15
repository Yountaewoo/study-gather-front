"use client"

import type React from "react"

import { BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const checkLoginStatus = () => {
    const cookies = document.cookie.split(";")
    const hasAccessToken = cookies.some((cookie) => cookie.trim().startsWith("accessToken="))
    console.log("[v0] Login status check - hasAccessToken:", hasAccessToken)
    setIsLoggedIn(hasAccessToken)
  }

  useEffect(() => {
    checkLoginStatus()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "login-status") {
        checkLoginStatus()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    window.addEventListener("focus", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", checkLoginStatus)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        setIsLoggedIn(false)
        localStorage.setItem("login-status", "false")
        router.push("/")
      } else {
        alert("로그아웃에 실패했습니다.")
      }
    } catch (error) {
      console.error("Logout error:", error)
      alert("로그아웃 중 오류가 발생했습니다.")
    }
  }

  const handleCreateStudy = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      alert("로그인이 필요합니다.")
      router.push("/login")
    }
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">스터디모여</h1>
        </Link>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                로그아웃
              </Button>
              <Button asChild>
                <Link href="/posts/create">스터디 만들기</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
              <Button onClick={handleCreateStudy}>스터디 만들기</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
