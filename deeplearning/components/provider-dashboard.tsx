"use client"

/**
 * DASHBOARD DO PRESTADOR DE SERVIÇOS
 *
 * Este componente implementa o dashboard completo para prestadores de serviços,
 * incluindo todas as funcionalidades específicas conforme especificação:
 *
 * FUNCIONALIDADES PRINCIPAIS:
 * 1. Gestão de Perfil Profissional - Cadastro completo com dados profissionais
 * 2. Solicitação para se tornar Prestador - Processo de aprovação
 * 3. Gestão de Pedidos - Aceitar/rejeitar pedidos e acompanhar histórico
 * 4. Controle Financeiro - Histórico de pagamentos e faturamento
 * 5. Reputação e Métricas - Avaliações e estatísticas de desempenho
 *
 * DIFERENÇAS DO DASHBOARD DO CLIENTE:
 * - Foco em receber e gerenciar pedidos (não fazer pedidos)
 * - Configuração de área de atuação e preços
 * - Métricas de desempenho profissional
 * - Controle financeiro detalhado
 * - Sistema de aprovação para se tornar prestador
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Star,
  MapPin,
  Edit,
  Camera,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Phone,
  FileText,
  Award,
  AlertCircle,
  Check,
  X,
  Eye,
  MessageSquare,
} from "lucide-react"

// Interfaces específicas do prestador
interface ProviderProfile {
  // Dados pessoais
  name: string
  phone: string
  email: string
  cpfCnpj: string

  // Dados profissionais específicos do prestador
  workAddress: string // Endereço de atuação
  bio: string // Biografia profissional
  categories: string[] // Categorias de serviço
  serviceRadius: number // Raio de atendimento em km
  minPrice: number // Preço mínimo

  // Métricas e reputação
  rating: number
  totalJobs: number
  monthlyEarnings: number
  responseTime: string // Tempo médio de resposta
  acceptanceRate: number // Taxa de aceitação
  completionRate: number // Taxa de conclusão

  // Status do prestador
  isApproved: boolean // Se foi aprovado como prestador
  approvalStatus: "pending" | "approved" | "rejected" | "not_requested"
}

// Pedidos específicos para prestadores (recebidos, não enviados)
interface ProviderOrder {
  id: string
  clientName: string
  clientPhone: string
  service: string
  description: string
  status: "new" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled"
  requestDate: string
  scheduledDate?: string
  price: number
  clientAddress: string
  urgency: "low" | "medium" | "high"
  estimatedDuration: string
}

// Histórico financeiro específico do prestador
interface ProviderPayment {
  id: string
  orderId: string
  clientName: string
  service: string
  grossAmount: number // Valor bruto
  platformFee: number // Taxa da plataforma
  netAmount: number // Valor líquido
  date: string
  status: "pending" | "processing" | "completed" | "failed"
  paymentMethod: string
}

// Avaliações recebidas pelo prestador
interface ProviderReview {
  id: string
  orderId: string
  clientName: string
  rating: number
  comment: string
  date: string
  service: string
}

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showApprovalRequest, setShowApprovalRequest] = useState(false)

  // Estado do perfil do prestador
  const [profile, setProfile] = useState<ProviderProfile>({
    name: "João Silva",
    phone: "(11) 99999-9999",
    email: "joao@email.com",
    cpfCnpj: "123.456.789-00",
    workAddress: "São Paulo, SP - Zona Sul",
    bio: "Eletricista com 10 anos de experiência em instalações residenciais e comerciais. Especialista em sistemas elétricos prediais, automação residencial e manutenção preventiva.",
    categories: ["Elétrica", "Automação Residencial"],
    serviceRadius: 15,
    minPrice: 80,
    rating: 4.8,
    totalJobs: 156,
    monthlyEarnings: 2450,
    responseTime: "2h 15min",
    acceptanceRate: 85,
    completionRate: 98,
    isApproved: true,
    approvalStatus: "approved",
  })

  // Pedidos recebidos pelo prestador
  const [orders] = useState<ProviderOrder[]>([
    {
      id: "1",
      clientName: "Maria Santos",
      clientPhone: "(11) 98888-8888",
      service: "Instalação elétrica",
      description: "Preciso instalar 3 tomadas na cozinha e trocar o quadro elétrico",
      status: "new",
      requestDate: "2024-01-15T10:30:00",
      price: 150,
      clientAddress: "Vila Madalena, SP",
      urgency: "medium",
      estimatedDuration: "4 horas",
    },
    {
      id: "2",
      clientName: "Carlos Lima",
      clientPhone: "(11) 97777-7777",
      service: "Reparo emergencial",
      description: "Tomada fazendo faísca, preciso de atendimento urgente",
      status: "accepted",
      requestDate: "2024-01-14T14:20:00",
      scheduledDate: "2024-01-16T09:00:00",
      price: 120,
      clientAddress: "Pinheiros, SP",
      urgency: "high",
      estimatedDuration: "2 horas",
    },
    {
      id: "3",
      clientName: "Ana Costa",
      clientPhone: "(11) 96666-6666",
      service: "Instalação de chuveiro",
      description: "Instalação de chuveiro elétrico no banheiro social",
      status: "completed",
      requestDate: "2024-01-12T16:45:00",
      scheduledDate: "2024-01-13T14:00:00",
      price: 100,
      clientAddress: "Jardins, SP",
      urgency: "low",
      estimatedDuration: "3 horas",
    },
  ])

  // Histórico financeiro do prestador
  const [payments] = useState<ProviderPayment[]>([
    {
      id: "1",
      orderId: "3",
      clientName: "Ana Costa",
      service: "Instalação de chuveiro",
      grossAmount: 100,
      platformFee: 5, // 5% da plataforma
      netAmount: 95,
      date: "2024-01-14",
      status: "completed",
      paymentMethod: "PIX",
    },
    {
      id: "2",
      orderId: "2",
      clientName: "Carlos Lima",
      service: "Reparo emergencial",
      grossAmount: 120,
      platformFee: 6,
      netAmount: 114,
      date: "2024-01-16",
      status: "pending",
      paymentMethod: "Cartão",
    },
  ])

  // Avaliações recebidas
  const [reviews] = useState<ProviderReview[]>([
    {
      id: "1",
      orderId: "3",
      clientName: "Ana Costa",
      rating: 5,
      comment: "Excelente profissional! Pontual, educado e fez um trabalho impecável.",
      date: "2024-01-14",
      service: "Instalação de chuveiro",
    },
    {
      id: "2",
      orderId: "4",
      clientName: "Roberto Silva",
      rating: 4,
      comment: "Bom trabalho, resolveu o problema rapidamente.",
      date: "2024-01-10",
      service: "Reparo tomada",
    },
  ])

  /**
   * FUNÇÕES UTILITÁRIAS
   * Funções para formatação e manipulação de dados específicos do prestador
   */

  // Função para obter cor do status do pedido
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para obter texto do status do pedido
  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "Novo Pedido"
      case "accepted":
        return "Aceito"
      case "rejected":
        return "Rejeitado"
      case "in-progress":
        return "Em Andamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Função para obter cor da urgência
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para aceitar pedido
  const handleAcceptOrder = (orderId: string) => {
    // Lógica para aceitar pedido
    console.log("[v0] Aceitando pedido:", orderId)
  }

  // Função para rejeitar pedido
  const handleRejectOrder = (orderId: string) => {
    // Lógica para rejeitar pedido
    console.log("[v0] Rejeitando pedido:", orderId)
  }

  return (
    <div className="space-y-6">
      {/* HEADER COM MÉTRICAS PRINCIPAIS DO PRESTADOR */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pedidos Pendentes - Específico do prestador */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Pedidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{orders.filter((o) => o.status === "new").length}</div>
            <p className="text-xs text-muted-foreground">Aguardando resposta</p>
          </CardContent>
        </Card>

        {/* Pedidos Aceitos - Em andamento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {orders.filter((o) => ["accepted", "in-progress"].includes(o.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">Serviços ativos</p>
          </CardContent>
        </Card>

        {/* Avaliação Média - Reputação do prestador */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary flex items-center gap-1">
              {profile.rating}
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">{profile.totalJobs} trabalhos</p>
          </CardContent>
        </Card>

        {/* Faturamento Mensal - Específico do prestador */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {profile.monthlyEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL - Específica para prestadores */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="profile">Perfil Profissional</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="reputation">Reputação</TabsTrigger>
        </TabsList>

        {/* ABA VISÃO GERAL - Dashboard principal do prestador */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pedidos Recentes Recebidos */}
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>Últimos pedidos recebidos de clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{order.service}</p>
                        <Badge className={getUrgencyColor(order.urgency)}>
                          {order.urgency === "high" ? "Urgente" : order.urgency === "medium" ? "Normal" : "Baixa"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.clientName}</p>
                      <Badge className={getOrderStatusColor(order.status)}>{getOrderStatusText(order.status)}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">R$ {order.price}</p>
                      <p className="text-sm text-muted-foreground">{order.estimatedDuration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Métricas de Performance do Prestador */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>Seus indicadores de desempenho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxa de aceitação</span>
                  <span className="font-bold text-primary">{profile.acceptanceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxa de conclusão</span>
                  <span className="font-bold text-green-600">{profile.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tempo médio resposta</span>
                  <span className="font-bold">{profile.responseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trabalhos este mês</span>
                  <span className="font-bold">{orders.filter((o) => o.status === "completed").length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status de Aprovação como Prestador */}
          {!profile.isApproved && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-5 w-5" />
                  Status de Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.approvalStatus === "not_requested" && (
                  <div className="space-y-4">
                    <p className="text-yellow-700">
                      Para receber pedidos, você precisa ser aprovado como prestador de serviços.
                    </p>
                    <Button onClick={() => setShowApprovalRequest(true)}>Solicitar Aprovação</Button>
                  </div>
                )}
                {profile.approvalStatus === "pending" && (
                  <p className="text-yellow-700">
                    Sua solicitação está em análise. Você receberá uma resposta em até 48 horas.
                  </p>
                )}
                {profile.approvalStatus === "rejected" && (
                  <div className="space-y-4">
                    <p className="text-red-700">
                      Sua solicitação foi rejeitada. Verifique seus dados e tente novamente.
                    </p>
                    <Button variant="outline" onClick={() => setShowApprovalRequest(true)}>
                      Nova Solicitação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ABA PEDIDOS - Gestão de pedidos recebidos */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Pedidos</CardTitle>
              <CardDescription>Gerencie os pedidos recebidos de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{order.service}</h4>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getOrderStatusText(order.status)}
                          </Badge>
                          <Badge className={getUrgencyColor(order.urgency)}>
                            {order.urgency === "high" ? "Urgente" : order.urgency === "medium" ? "Normal" : "Baixa"}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Cliente:</span> {order.clientName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Telefone:</span> {order.clientPhone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Local:</span> {order.clientAddress}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Solicitado:</span>{" "}
                              {new Date(order.requestDate).toLocaleString()}
                            </div>
                            {order.scheduledDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Agendado:</span>{" "}
                                {new Date(order.scheduledDate).toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Duração:</span> {order.estimatedDuration}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="font-medium">Descrição do serviço:</p>
                          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">{order.description}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-2 ml-4">
                        <div className="text-xl font-bold text-primary">R$ {order.price}</div>

                        {/* Ações específicas por status */}
                        {order.status === "new" && (
                          <div className="flex flex-col gap-2">
                            <Button size="sm" onClick={() => handleAcceptOrder(order.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              Aceitar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectOrder(order.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-1" />
                              Detalhes
                            </Button>
                          </div>
                        )}

                        {order.status === "accepted" && (
                          <div className="flex flex-col gap-2">
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contatar Cliente
                            </Button>
                            <Button size="sm" variant="outline">
                              Iniciar Serviço
                            </Button>
                          </div>
                        )}

                        {order.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Ver Avaliação
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA PERFIL PROFISSIONAL - Específico do prestador */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Perfil Profissional</CardTitle>
                <CardDescription>Configure suas informações e área de atuação</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditingProfile ? "Cancelar" : "Editar"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto e informações básicas */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/professional-electrician.png" />
                  <AvatarFallback className="text-lg">JS</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {profile.rating} ({profile.totalJobs} trabalhos)
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.workAddress}
                    </div>
                  </div>
                  {!isEditingProfile && (
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Alterar foto
                    </Button>
                  )}
                </div>
              </div>

              {/* Dados pessoais e profissionais */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Dados Pessoais</h4>

                  <div>
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                    <Input
                      id="cpfCnpj"
                      value={profile.cpfCnpj}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, cpfCnpj: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Configurações Profissionais</h4>

                  <div>
                    <Label htmlFor="workAddress">Endereço de atuação *</Label>
                    <Input
                      id="workAddress"
                      value={profile.workAddress}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, workAddress: e.target.value })}
                      placeholder="Ex: São Paulo, SP - Zona Sul"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceRadius">Raio de atendimento (km) *</Label>
                    <Input
                      id="serviceRadius"
                      type="number"
                      value={profile.serviceRadius}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, serviceRadius: Number(e.target.value) })}
                      min="1"
                      max="50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Distância máxima que você atende a partir do seu endereço base
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="minPrice">Preço mínimo (R$) *</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      value={profile.minPrice}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, minPrice: Number(e.target.value) })}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Valor mínimo que você cobra por serviço</p>
                  </div>

                  <div>
                    <Label htmlFor="categories">Categorias de serviço *</Label>
                    <Select disabled={!isEditingProfile}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione suas especialidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eletrica">Elétrica</SelectItem>
                        <SelectItem value="encanamento">Encanamento</SelectItem>
                        <SelectItem value="pintura">Pintura</SelectItem>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                        <SelectItem value="jardinagem">Jardinagem</SelectItem>
                        <SelectItem value="marcenaria">Marcenaria</SelectItem>
                        <SelectItem value="automacao">Automação Residencial</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Biografia profissional */}
              <div>
                <Label htmlFor="bio">Biografia profissional *</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  disabled={!isEditingProfile}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Descreva sua experiência, especialidades e diferenciais..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Esta descrição será vista pelos clientes. Destaque sua experiência e especialidades.
                </p>
              </div>

              {/* Botões de ação */}
              {isEditingProfile && (
                <div className="flex gap-4">
                  <Button onClick={() => setIsEditingProfile(false)}>Salvar alterações</Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA FINANCEIRO - Controle financeiro do prestador */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
                <CardDescription>Seu faturamento e ganhos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                  <span className="font-medium">Faturamento bruto</span>
                  <span className="text-xl font-bold text-primary">R$ {profile.monthlyEarnings.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Taxa da plataforma (5%)</span>
                  <span className="font-bold text-red-600">- R$ {Math.round(profile.monthlyEarnings * 0.05)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pagamentos pendentes</span>
                  <span className="font-bold text-yellow-600">
                    R$ {payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.netAmount, 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-t-2 border-green-500">
                  <span className="font-medium text-green-800">Valor líquido</span>
                  <span className="text-xl font-bold text-green-600">
                    R$ {Math.round(profile.monthlyEarnings * 0.95).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Pagamentos */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>Seus recebimentos detalhados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{payment.service}</p>
                          <p className="text-sm text-muted-foreground">Cliente: {payment.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.date} • {payment.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm text-muted-foreground">Bruto: R$ {payment.grossAmount}</p>
                          <p className="text-sm text-red-600">Taxa: -R$ {payment.platformFee}</p>
                          <p className="font-bold text-green-600">Líquido: R$ {payment.netAmount}</p>
                          <Badge
                            className={
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {payment.status === "completed"
                              ? "Pago"
                              : payment.status === "pending"
                                ? "Pendente"
                                : "Falhou"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABA REPUTAÇÃO - Avaliações e métricas */}
        <TabsContent value="reputation" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Métricas de Reputação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Sua Reputação
                </CardTitle>
                <CardDescription>Como os clientes avaliam seu trabalho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                    {profile.rating}
                    <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
                  </div>
                  <p className="text-muted-foreground">Baseado em {reviews.length} avaliações</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Taxa de conclusão</span>
                    <span className="font-bold text-green-600">{profile.completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tempo médio de resposta</span>
                    <span className="font-bold">{profile.responseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Taxa de aceitação</span>
                    <span className="font-bold text-primary">{profile.acceptanceRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avaliações Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recentes</CardTitle>
                <CardDescription>O que os clientes dizem sobre você</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.clientName}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.service}</p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL DE SOLICITAÇÃO DE APROVAÇÃO */}
      <Dialog open={showApprovalRequest} onOpenChange={setShowApprovalRequest}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitação para se tornar Prestador</DialogTitle>
            <DialogDescription>
              Complete as informações abaixo para solicitar aprovação como prestador de serviços
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <h4 className="font-semibold">Documentos necessários:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="cpf" />
                  <Label htmlFor="cpf">CPF ou CNPJ válido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="address" />
                  <Label htmlFor="address">Comprovante de endereço</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="experience" />
                  <Label htmlFor="experience">Certificados ou comprovantes de experiência</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Informações adicionais:</h4>
              <Textarea
                placeholder="Descreva sua experiência profissional, certificações e por que deveria ser aprovado..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalRequest(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowApprovalRequest(false)}>Enviar Solicitação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
