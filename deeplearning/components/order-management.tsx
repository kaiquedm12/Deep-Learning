"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  Star,
  AlertTriangle,
  FileText,
} from "lucide-react"

interface OrderRequest {
  service: string
  description: string
  address: string
  preferredDate: string
  preferredTime: string
  budget: number
  urgency: "low" | "medium" | "high"
}

interface Provider {
  id: string
  name: string
  rating: number
  totalJobs: number
  price: number
  distance: number
  avatar: string
  specialties: string[]
  responseTime: string
}

interface OrderDetails {
  id: string
  service: string
  description: string
  status: "creating" | "matching" | "quoted" | "scheduled" | "in-progress" | "completed" | "cancelled"
  client: {
    name: string
    phone: string
    address: string
  }
  provider?: {
    name: string
    phone: string
    rating: number
    avatar: string
  }
  scheduledDate?: string
  price?: number
  createdAt: string
  messages: Array<{
    id: string
    sender: "client" | "provider" | "system"
    message: string
    timestamp: string
  }>
}

export default function OrderManagement({ userRole }: { userRole: "client" | "provider" | "admin" }) {
  const [currentStep, setCurrentStep] = useState<"search" | "providers" | "details" | "tracking">("search")
  const [orderRequest, setOrderRequest] = useState<OrderRequest>({
    service: "",
    description: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    budget: 0,
    urgency: "medium",
  })

  const [availableProviders] = useState<Provider[]>([
    {
      id: "1",
      name: "João Silva",
      rating: 4.8,
      totalJobs: 156,
      price: 120,
      distance: 2.5,
      avatar: "/placeholder.svg?height=40&width=40",
      specialties: ["Instalação", "Reparo", "Manutenção"],
      responseTime: "Responde em 15min",
    },
    {
      id: "2",
      name: "Ana Costa",
      rating: 4.9,
      totalJobs: 203,
      price: 100,
      distance: 3.2,
      avatar: "/placeholder.svg?height=40&width=40",
      specialties: ["Limpeza completa", "Organização"],
      responseTime: "Responde em 30min",
    },
    {
      id: "3",
      name: "Carlos Lima",
      rating: 4.6,
      totalJobs: 89,
      price: 150,
      distance: 1.8,
      avatar: "/placeholder.svg?height=40&width=40",
      specialties: ["Pintura", "Acabamento"],
      responseTime: "Responde em 1h",
    },
  ])

  const [selectedOrder, setSelectedOrder] = useState<OrderDetails>({
    id: "ORD-001",
    service: "Instalação elétrica",
    description: "Instalação de tomadas na cozinha e troca do chuveiro",
    status: "scheduled",
    client: {
      name: "Maria Santos",
      phone: "(11) 98888-8888",
      address: "Rua das Flores, 123 - Vila Madalena, SP",
    },
    provider: {
      name: "João Silva",
      phone: "(11) 99999-9999",
      rating: 4.8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    scheduledDate: "2024-01-18 14:00",
    price: 150,
    createdAt: "2024-01-15",
    messages: [
      {
        id: "1",
        sender: "system",
        message: "Pedido criado e enviado para prestadores",
        timestamp: "2024-01-15 10:00",
      },
      {
        id: "2",
        sender: "provider",
        message: "Olá! Posso fazer o serviço amanhã às 14h. O valor seria R$ 150.",
        timestamp: "2024-01-15 10:30",
      },
      {
        id: "3",
        sender: "client",
        message: "Perfeito! Confirmo para amanhã às 14h.",
        timestamp: "2024-01-15 11:00",
      },
    ],
  })

  const [newMessage, setNewMessage] = useState("")

  const handleCreateOrder = () => {
    // In real app, this would call an API
    setCurrentStep("providers")
  }

  const handleSelectProvider = (providerId: string) => {
    // In real app, this would create the order with selected provider
    setCurrentStep("tracking")
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      sender: userRole as "client" | "provider",
      message: newMessage,
      timestamp: new Date().toLocaleString(),
    }

    setSelectedOrder({
      ...selectedOrder,
      messages: [...selectedOrder.messages, message],
    })
    setNewMessage("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "creating":
        return "bg-blue-100 text-blue-800"
      case "matching":
        return "bg-yellow-100 text-yellow-800"
      case "quoted":
        return "bg-purple-100 text-purple-800"
      case "scheduled":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "creating":
        return "Criando pedido"
      case "matching":
        return "Procurando prestador"
      case "quoted":
        return "Aguardando confirmação"
      case "scheduled":
        return "Agendado"
      case "in-progress":
        return "Em andamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (userRole === "client" && currentStep === "search") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Novo Pedido</CardTitle>
          <CardDescription>Descreva o serviço que você precisa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="service">Tipo de serviço</Label>
              <Select
                value={orderRequest.service}
                onValueChange={(value) => setOrderRequest({ ...orderRequest, service: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eletrica">Elétrica</SelectItem>
                  <SelectItem value="encanamento">Encanamento</SelectItem>
                  <SelectItem value="limpeza">Limpeza</SelectItem>
                  <SelectItem value="pintura">Pintura</SelectItem>
                  <SelectItem value="jardinagem">Jardinagem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Descrição detalhada</Label>
              <Textarea
                id="description"
                placeholder="Descreva o que precisa ser feito..."
                value={orderRequest.description}
                onChange={(e) => setOrderRequest({ ...orderRequest, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Onde o serviço será realizado"
                value={orderRequest.address}
                onChange={(e) => setOrderRequest({ ...orderRequest, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data preferida</Label>
                <Input
                  id="date"
                  type="date"
                  value={orderRequest.preferredDate}
                  onChange={(e) => setOrderRequest({ ...orderRequest, preferredDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Horário preferido</Label>
                <Input
                  id="time"
                  type="time"
                  value={orderRequest.preferredTime}
                  onChange={(e) => setOrderRequest({ ...orderRequest, preferredTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Valor máximo"
                  value={orderRequest.budget}
                  onChange={(e) => setOrderRequest({ ...orderRequest, budget: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgência</Label>
                <Select
                  value={orderRequest.urgency}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setOrderRequest({ ...orderRequest, urgency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={handleCreateOrder} className="w-full" size="lg">
            <Search className="h-5 w-5 mr-2" />
            Buscar Prestadores
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (userRole === "client" && currentStep === "providers") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prestadores Disponíveis</CardTitle>
            <CardDescription>Escolha o prestador ideal para seu serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={provider.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {provider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold">{provider.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                              {provider.rating} ({provider.totalJobs} trabalhos)
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {provider.distance}km de distância
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {provider.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{provider.responseTime}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-primary">R$ {provider.price}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" onClick={() => handleSelectProvider(provider.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Contratar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Order tracking view (for all user types)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pedido #{selectedOrder.id}
              </CardTitle>
              <CardDescription>{selectedOrder.service}</CardDescription>
            </div>
            <Badge className={getStatusColor(selectedOrder.status)}>{getStatusText(selectedOrder.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Detalhes do Serviço</h4>
                <p className="text-sm text-muted-foreground">{selectedOrder.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Endereço</h4>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedOrder.client.address}
                </div>
              </div>
              {selectedOrder.scheduledDate && (
                <div>
                  <h4 className="font-semibold mb-2">Data Agendada</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {selectedOrder.scheduledDate}
                  </div>
                </div>
              )}
              {selectedOrder.price && (
                <div>
                  <h4 className="font-semibold mb-2">Valor</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    R$ {selectedOrder.price}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Cliente</h4>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedOrder.client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedOrder.client.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.client.phone}
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.provider && (
                <div>
                  <h4 className="font-semibold mb-2">Prestador</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedOrder.provider.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedOrder.provider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedOrder.provider.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {selectedOrder.provider.rating}
                        <Phone className="h-3 w-3 ml-2" />
                        {selectedOrder.provider.phone}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Messages */}
          <div className="space-y-4">
            <h4 className="font-semibold">Conversas</h4>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
              {selectedOrder.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === userRole ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === "system"
                        ? "bg-muted text-muted-foreground text-center w-full"
                        : message.sender === userRole
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {selectedOrder.status === "scheduled" && userRole === "provider" && (
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Iniciar Serviço
              </Button>
            )}
            {selectedOrder.status === "in-progress" && userRole === "provider" && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar Serviço
              </Button>
            )}
            {["scheduled", "in-progress"].includes(selectedOrder.status) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancelar Pedido</DialogTitle>
                    <DialogDescription>Tem certeza que deseja cancelar este pedido?</DialogDescription>
                  </DialogHeader>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Política de Cancelamento</p>
                        <p className="text-sm text-yellow-700">
                          Cancelamentos podem estar sujeitos a taxas dependendo do timing.
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Manter Pedido</Button>
                    <Button variant="destructive">Confirmar Cancelamento</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
