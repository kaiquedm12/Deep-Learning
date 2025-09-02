"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/mock-auth"
import ClientDashboard from "@/components/client-dashboard"
import { Navbar } from "@/components/navbar"

export default function ClientDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "CLIENTE") {
      router.push("/auth/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "CLIENTE") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard do Cliente</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos e encontre prestadores de serviços</p>
        </div>
        <ClientDashboard />
      </main>
    </div>
  )
}
