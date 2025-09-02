"use client"

/**
 * Mock Authentication System
 *
 * Sistema de autenticação simulado para demonstração frontend.
 * Substitui NextAuth.js com localStorage para persistência de sessão.
 */

export interface User {
  id: string
  name: string
  email: string
  role: "CLIENTE" | "PRESTADOR" | "ADMIN"
  phone?: string
  cpfCnpj?: string
}

export interface Session {
  user: User
  expires: string
}

// Usuários de demonstração
const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@demo.com",
    role: "ADMIN",
    phone: "(11) 99999-9999",
  },
  {
    id: "2",
    name: "João Silva",
    email: "prestador@demo.com",
    role: "PRESTADOR",
    phone: "(11) 98888-8888",
    cpfCnpj: "123.456.789-00",
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "cliente@demo.com",
    role: "CLIENTE",
    phone: "(11) 97777-7777",
    cpfCnpj: "987.654.321-00",
  },
]

/**
 * Simula login com credenciais
 */
export async function signIn(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Verificar credenciais (senha demo: 123456)
  if (password !== "123456") {
    return { success: false, error: "Senha incorreta" }
  }

  const user = DEMO_USERS.find((u) => u.email === email)
  if (!user) {
    return { success: false, error: "Usuário não encontrado" }
  }

  // Salvar sessão no localStorage
  const session: Session = {
    user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
  }

  localStorage.setItem("session", JSON.stringify(session))

  return { success: true, user }
}

/**
 * Simula registro de novo usuário
 */
export async function signUp(userData: {
  name: string
  email: string
  password: string
  role: "CLIENTE" | "PRESTADOR"
  phone?: string
  cpfCnpj?: string
}): Promise<{ success: boolean; error?: string; user?: User }> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Verificar se email já existe
  const existingUser = DEMO_USERS.find((u) => u.email === userData.email)
  if (existingUser) {
    return { success: false, error: "Email já cadastrado" }
  }

  // Criar novo usuário
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
    phone: userData.phone,
    cpfCnpj: userData.cpfCnpj,
  }

  // Adicionar à lista (em produção seria salvo no banco)
  DEMO_USERS.push(newUser)

  // Criar sessão automaticamente
  const session: Session = {
    user: newUser,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  localStorage.setItem("session", JSON.stringify(session))

  return { success: true, user: newUser }
}

/**
 * Obtém sessão atual
 */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem("session")
  if (!sessionData) return null

  try {
    const session: Session = JSON.parse(sessionData)

    // Verificar se sessão expirou
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem("session")
      return null
    }

    return session
  } catch {
    localStorage.removeItem("session")
    return null
  }
}

/**
 * Faz logout do usuário
 */
export function signOut(): void {
  localStorage.removeItem("session")
}

/**
 * Hook para usar autenticação
 */
export function useAuth() {
  const session = getSession()

  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
  }
}
