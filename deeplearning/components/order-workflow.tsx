"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  MessageCircle,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react"

interface Order {
  id: string
  descricao: string
  endereco: string
  preco: number
  status: "AGUARDANDO" | "MATCHING" | "AGENDADO" | "CONCLUIDO" | "CANCELADO"
  dataServico?: string
  createdAt: string
  cliente: {
    name: string
    email: string
    phone?: string
  }
  prestador?: {
    id: string
    user: {
      name: string
      email: string
      phone?: string
    }
  }
  service: {
    nome: string
    category: {
      nome: string
    }
  }
  payment?: {
    id: string
    status: "PENDENTE" | "PAGO" | "CANCELADO" | "REEMBOLSADO"
    metodoPagamento?: string
    valor: number
    taxa: number
  }
  review?: {
    id: string
    nota: number
    comentario?: string
  }
}

interface OrderWorkflowProps {
  userRole: "CLIENTE" | "PRESTADOR" | "ADMIN"
  userId: string
}

export default function OrderWorkflow({ userRole, userId }: OrderWorkflowProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, additionalData?: any) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...additionalData,
        }),
      })

      if (response.ok) {
        setSuccess("Status atualizado com sucesso!")
        fetchOrders()
      } else {
        const data = await response.json()
        setError(data.message || "Erro ao atualizar status")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    }
  }

  const processPayment = async () => {
    if (!selectedOrder || !paymentMethod) return

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          metodoPagamento: paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess("Pagamento processado com sucesso!")
        setShowPaymentDialog(false)
        fetchOrders()
      } else {
        setError(data.message || "Falha no processamento do pagamento")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AGUARDANDO":
        return "bg-yellow-100 text-yellow-800"
      case "MATCHING":
        return "bg-blue-100 text-blue-800"
      case "AGENDADO":
        return "bg-purple-100 text-purple-800"
      case "CONCLUIDO":
        return "bg-green-100 text-green-800"
      case "CANCELADO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "AGUARDANDO":
        return "Aguardando"
      case "MATCHING":
        return "Procurando prestador"
      case "AGENDADO":
        return "Agendado"
      case "CONCLUIDO":
        return "Concluído"
      case "CANCELADO":
        return "Cancelado"
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAGO":
        return "bg-green-100 text-green-800"
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELADO":
        return "bg-red-100 text-red-800"
      case "REEMBOLSADO":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito"
      case "debit_card":
        return "Cartão de Débito"
      case "pix":
        return "PIX"
      case "bank_transfer":
        return "Transferência Bancária"
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando pedidos...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground">
                {userRole === "CLIENTE" ? "Você ainda não fez nenhum pedido" : "Você ainda não recebeu nenhum pedido"}
              </p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Pedido #{order.id.slice(-8)}
                    </CardTitle>
                    <CardDescription>{order.service.nome}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{order.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Criado em: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {order.dataServico && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Agendado para: {new Date(order.dataServico).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">R$ {order.preco.toFixed(2)}</span>
                    </div>

                    {/* Client/Provider Info */}
                    {userRole === "PRESTADOR" && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{order.cliente.name}</p>
                          {order.cliente.phone && (
                            <p className="text-xs text-muted-foreground">{order.cliente.phone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {userRole === "CLIENTE" && order.prestador && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {order.prestador.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{order.prestador.user.name}</p>
                          {order.prestador.user.phone && (
                            <p className="text-xs text-muted-foreground">{order.prestador.user.phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">Descrição do serviço</h4>
                  <p className="text-sm text-muted-foreground">{order.descricao}</p>
                </div>

                {/* Payment Info */}
                {order.payment && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Pagamento</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.payment.metodoPagamento && getPaymentMethodText(order.payment.metodoPagamento)}
                        </p>
                      </div>
                      <Badge className={getPaymentStatusColor(order.payment.status)}>{order.payment.status}</Badge>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {/* Provider Actions */}
                  {userRole === "PRESTADOR" && order.status === "AGUARDANDO" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "MATCHING", { prestadorId: userId })}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aceitar
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="h-4 w-4 mr-1" />
                        Recusar
                      </Button>
                    </>
                  )}

                  {userRole === "PRESTADOR" && order.status === "AGENDADO" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "CONCLUIDO")}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar como Concluído
                    </Button>
                  )}

                  {/* Client Actions */}
                  {userRole === "CLIENTE" && order.status === "CONCLUIDO" && !order.payment && (
                    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedOrder(order)}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pagar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Processar Pagamento</DialogTitle>
                          <DialogDescription>Escolha o método de pagamento para finalizar o pedido</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <Label>Método de pagamento</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o método" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>Valor do serviço:</span>
                              <span>R$ {order.preco.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Taxa da plataforma (5%):</span>
                              <span>R$ {(order.preco * 0.05).toFixed(2)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>R$ {order.preco.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={processPayment} disabled={!paymentMethod}>
                            Confirmar Pagamento
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* General Actions */}
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>

                  {["AGUARDANDO", "MATCHING", "AGENDADO"].includes(order.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => updateOrderStatus(order.id, "CANCELADO")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
