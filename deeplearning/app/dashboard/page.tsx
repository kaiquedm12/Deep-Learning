"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/mock-auth"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Redirecionar baseado no role do usuário
    switch (user?.role) {
      case "ADMIN":
        router.push("/dashboard/admin")
        break
      case "PRESTADOR":
        router.push("/dashboard/prestador")
        break
      case "CLIENTE":
        router.push("/dashboard/cliente")
        break
      default:
        router.push("/auth/login")
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  )
}
