"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageCircle,
  Home,
  Building,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import OrderManagement from "@/components/order-management"
import RatingPaymentSystem from "@/components/rating-payment-system"

interface ClientProfile {
  name: string
  phone: string
  email: string
  cpfCnpj: string
}

interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface ClientOrder {
  id: string
  service: string
  providerName: string
  status: "waiting" | "matching" | "scheduled" | "completed" | "cancelled"
  date: string
  scheduledDate?: string
  price: number
  address: string
  description: string
  canCancel: boolean
}

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("search")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)

  const [profile, setProfile] = useState<ClientProfile>({
    name: "Maria Santos",
    phone: "(11) 98888-8888",
    email: "maria@email.com",
    cpfCnpj: "987.654.321-00",
  })

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Casa",
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true,
    },
    {
      id: "2",
      label: "Trabalho",
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      isDefault: false,
    },
  ])

  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  })

  const [orders, setOrders] = useState<ClientOrder[]>([
    {
      id: "1",
      service: "Instalação elétrica",
      providerName: "João Silva",
      status: "scheduled",
      date: "2024-01-15",
      scheduledDate: "2024-01-18 14:00",
      price: 150,
      address: "Rua das Flores, 123",
      description: "Instalação de tomadas na cozinha",
      canCancel: true,
    },
    {
      id: "2",
      service: "Limpeza residencial",
      providerName: "Ana Costa",
      status: "matching",
      date: "2024-01-14",
      price: 120,
      address: "Av. Paulista, 1000",
      description: "Limpeza completa do escritório",
      canCancel: true,
    },
    {
      id: "3",
      service: "Reparo encanamento",
      providerName: "Carlos Lima",
      status: "completed",
      date: "2024-01-10",
      scheduledDate: "2024-01-12 09:00",
      price: 80,
      address: "Rua das Flores, 123",
      description: "Reparo vazamento pia",
      canCancel: false,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case "waiting":
        return "Aguardando"
      case "matching":
        return "Procurando prestador"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="h-4 w-4" />
      case "matching":
        return <Search className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleAddAddress = () => {
    const newId = (addresses.length + 1).toString()
    setAddresses([...addresses, { ...newAddress, id: newId }])
    setNewAddress({
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    })
    setIsAddingAddress(false)
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleCancelOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" as const, canCancel: false } : order,
      ),
    )
    setCancelOrderId(null)
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {orders.filter((o) => ["waiting", "matching", "scheduled"].includes(o.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {orders.filter((o) => o.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endereços</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{addresses.length}</div>
            <p className="text-xs text-muted-foreground">Salvos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.price, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="search">Buscar</TabsTrigger>
          <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
          <TabsTrigger value="addresses">Endereços</TabsTrigger>
          <TabsTrigger value="ratings">Avaliações</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <OrderManagement userRole="client" />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
              <CardDescription>Acompanhe o status de todos os seus pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{order.service}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            Prestador: {order.providerName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.address}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Solicitado em: {order.date}
                          </div>
                          {order.scheduledDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Agendado para: {order.scheduledDate}
                            </div>
                          )}
                        </div>
                        <p className="text-sm">{order.description}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-xl font-bold text-primary">R$ {order.price}</div>
                        {order.canCancel && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancelar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancelar Pedido</DialogTitle>
                                <DialogDescription>
                                  Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div className="space-y-1">
                                      <p className="font-medium text-yellow-800">Política de Cancelamento</p>
                                      <p className="text-sm text-yellow-700">
                                        • Cancelamentos até 2h antes: reembolso total
                                        <br />• Cancelamentos com menos de 2h: taxa de 20%
                                        <br />• Após início do serviço: sem reembolso
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Manter Pedido</Button>
                                <Button variant="destructive" onClick={() => handleCancelOrder(order.id)}>
                                  Confirmar Cancelamento
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {order.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Star className="h-4 w-4 mr-1" />
                            Avaliar
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

        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Endereços Salvos</CardTitle>
                <CardDescription>Gerencie seus endereços para facilitar futuras solicitações</CardDescription>
              </div>
              <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Endereço</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="label">Nome do endereço</Label>
                      <Input
                        id="label"
                        placeholder="Ex: Casa, Trabalho, Mãe"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="street">Endereço completo</Label>
                      <Input
                        id="street"
                        placeholder="Rua, número, complemento"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          placeholder="São Paulo"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          placeholder="SP"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        placeholder="00000-000"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddAddress}>Salvar Endereço</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {address.label === "Casa" ? (
                          <Home className="h-5 w-5 text-primary" />
                        ) : (
                          <Building className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{address.label}</h4>
                          {address.isDefault && <Badge variant="secondary">Padrão</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.street}, {address.city} - {address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-6">
          <RatingPaymentSystem userRole="client" />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Gerencie suas informações pessoais</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditingProfile ? "Cancelar" : "Editar"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">MS</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input
                      id="cpfCnpj"
                      value={profile.cpfCnpj}
                      disabled={!isEditingProfile}
                      onChange={(e) => setProfile({ ...profile, cpfCnpj: e.target.value })}
                    />
                  </div>
                </div>
              </div>

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

        <TabsContent value="support" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Central de Ajuda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Precisa de ajuda? Entre em contato conosco através dos canais abaixo:
                </p>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat ao vivo
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp: (11) 99999-9999
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    suporte@servicosbr.com
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Políticas e Termos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    <div className="text-left">
                      <p className="font-medium">Política de Cancelamento</p>
                      <p className="text-sm text-muted-foreground">Saiba sobre reembolsos e cancelamentos</p>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    <div className="text-left">
                      <p className="font-medium">Termos de Uso</p>
                      <p className="text-sm text-muted-foreground">Leia nossos termos e condições</p>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    <div className="text-left">
                      <p className="font-medium">Política de Privacidade</p>
                      <p className="text-sm text-muted-foreground">Como protegemos seus dados</p>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                    <div className="text-left">
                      <p className="font-medium">Segurança</p>
                      <p className="text-sm text-muted-foreground">Medidas de segurança da plataforma</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
