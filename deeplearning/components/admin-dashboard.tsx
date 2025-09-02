"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Settings,
  Star,
  DollarSign,
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Phone,
  Mail,
} from "lucide-react"
import RatingPaymentSystem from "@/components/rating-payment-system"

interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: "client" | "provider"
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  totalOrders?: number
  rating?: number
}

interface ProviderApplication {
  id: string
  name: string
  email: string
  phone: string
  cpfCnpj: string
  categories: string[]
  experience: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  documents: string[]
}

interface SystemOrder {
  id: string
  clientName: string
  providerName: string
  service: string
  status: "waiting" | "matching" | "scheduled" | "completed" | "cancelled"
  date: string
  price: number
  location: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<ProviderApplication | null>(null)
  const [userFilter, setUserFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [users] = useState<AdminUser[]>([
    {
      id: "1",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 98888-8888",
      role: "client",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-15",
      totalOrders: 5,
    },
    {
      id: "2",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      role: "provider",
      status: "active",
      joinDate: "2024-01-05",
      lastActive: "2024-01-15",
      totalOrders: 23,
      rating: 4.8,
    },
    {
      id: "3",
      name: "Carlos Lima",
      email: "carlos@email.com",
      phone: "(11) 97777-7777",
      role: "provider",
      status: "suspended",
      joinDate: "2024-01-08",
      lastActive: "2024-01-12",
      totalOrders: 8,
      rating: 3.2,
    },
  ])

  const [applications] = useState<ProviderApplication[]>([
    {
      id: "1",
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "(11) 96666-6666",
      cpfCnpj: "123.456.789-00",
      categories: ["Limpeza", "Organização"],
      experience: "5 anos de experiência em limpeza residencial",
      status: "pending",
      appliedDate: "2024-01-14",
      documents: ["RG", "CPF", "Comprovante residência"],
    },
    {
      id: "2",
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      phone: "(11) 95555-5555",
      cpfCnpj: "987.654.321-00",
      categories: ["Pintura", "Reforma"],
      experience: "10 anos como pintor profissional",
      status: "pending",
      appliedDate: "2024-01-13",
      documents: ["RG", "CPF", "Certificado profissional"],
    },
  ])

  const [systemOrders] = useState<SystemOrder[]>([
    {
      id: "1",
      clientName: "Maria Santos",
      providerName: "João Silva",
      service: "Instalação elétrica",
      status: "scheduled",
      date: "2024-01-15",
      price: 150,
      location: "Vila Madalena, SP",
    },
    {
      id: "2",
      clientName: "Roberto Costa",
      providerName: "Ana Lima",
      service: "Limpeza residencial",
      status: "matching",
      date: "2024-01-14",
      price: 120,
      location: "Pinheiros, SP",
    },
    {
      id: "3",
      clientName: "Fernanda Souza",
      providerName: "Carlos Lima",
      service: "Reparo encanamento",
      status: "completed",
      date: "2024-01-12",
      price: 80,
      location: "Jardins, SP",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "matching":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "suspended":
        return "Suspenso"
      case "pending":
        return "Pendente"
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      case "waiting":
        return "Aguardando"
      case "matching":
        return "Procurando"
      case "scheduled":
        return "Agendado"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesFilter = userFilter === "all" || user.role === userFilter || user.status === userFilter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleApproveProvider = (applicationId: string) => {
    // In real app, this would call an API
    console.log("Approving provider application:", applicationId)
  }

  const handleRejectProvider = (applicationId: string) => {
    // In real app, this would call an API
    console.log("Rejecting provider application:", applicationId)
  }

  const handleSuspendUser = (userId: string) => {
    // In real app, this would call an API
    console.log("Suspending user:", userId)
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,234</div>
            <p className="text-xs text-muted-foreground">+12% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestadores Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">456</div>
            <p className="text-xs text-muted-foreground">+8% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">89</div>
            <p className="text-xs text-muted-foreground">+15% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ 45.6K</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="providers">Prestadores</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Novo prestador aprovado</p>
                    <p className="text-sm text-muted-foreground">João Silva - Elétrica</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2h atrás</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Pedido concluído</p>
                    <p className="text-sm text-muted-foreground">Maria Santos - Limpeza</p>
                  </div>
                  <span className="text-sm text-muted-foreground">4h atrás</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Nova solicitação</p>
                    <p className="text-sm text-muted-foreground">Ana Costa - Prestador</p>
                  </div>
                  <span className="text-sm text-muted-foreground">6h atrás</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxa de conversão</span>
                  <span className="font-bold text-primary">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tempo médio resposta</span>
                  <span className="font-bold">1h 45min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Satisfação média</span>
                  <span className="font-bold text-primary">4.6/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pedidos cancelados</span>
                  <span className="font-bold">8%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>Controle todos os usuários da plataforma</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="client">Clientes</SelectItem>
                      <SelectItem value="provider">Prestadores</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="suspended">Suspensos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Última atividade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role === "client" ? "Cliente" : "Prestador"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{user.totalOrders}</span>
                          {user.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                              <span className="text-sm">{user.rating}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Usuário</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Nome</Label>
                                      <p className="font-medium">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                      <Label>E-mail</Label>
                                      <p className="font-medium">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <Label>Telefone</Label>
                                      <p className="font-medium">{selectedUser.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Data de cadastro</Label>
                                      <p className="font-medium">{selectedUser.joinDate}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                            className={user.status === "suspended" ? "text-green-600" : "text-red-600"}
                          >
                            {user.status === "suspended" ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Prestadores</CardTitle>
              <CardDescription>Aprovar ou rejeitar novos prestadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{application.name}</h4>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusText(application.status)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {application.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            {application.categories.join(", ")}
                          </div>
                        </div>
                        <p className="text-sm">{application.experience}</p>
                        <div className="flex gap-2">
                          {application.documents.map((doc, index) => (
                            <Badge key={index} variant="outline">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground">Solicitado em {application.appliedDate}</p>
                        {application.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveProvider(application.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectProvider(application.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento de Pedidos</CardTitle>
              <CardDescription>Acompanhe todos os pedidos do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.service}</p>
                          <p className="text-sm text-muted-foreground">{order.location}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell>{order.providerName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">R$ {order.price}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <RatingPaymentSystem userRole="admin" />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Plataforma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Taxa da plataforma (%)</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label>Raio máximo de atendimento (km)</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label>Tempo limite para resposta (horas)</Label>
                  <Input type="number" defaultValue="24" />
                </div>
                <Button>Salvar configurações</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorias de Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {["Elétrica", "Encanamento", "Limpeza", "Pintura", "Jardinagem"].map((category) => (
                    <div key={category} className="flex items-center justify-between p-2 border rounded">
                      <span>{category}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Adicionar categoria
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
