"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, CreditCard, CheckCircle, XCircle, AlertTriangle, Clock, Receipt, TrendingUp } from "lucide-react"

interface Rating {
  id: string
  orderId: string
  clientName: string
  providerName: string
  rating: number
  comment: string
  date: string
  serviceType: string
}

interface Payment {
  id: string
  orderId: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  method: "credit_card" | "debit_card" | "pix" | "bank_transfer"
  date: string
  dueDate?: string
  clientName: string
  providerName: string
  serviceType: string
  platformFee: number
  providerAmount: number
}

interface RatingFormData {
  rating: number
  comment: string
  orderId: string
  providerName: string
  serviceType: string
}

export default function RatingPaymentSystem({ userRole }: { userRole: "client" | "provider" | "admin" }) {
  const [activeTab, setActiveTab] = useState("ratings")
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const [ratingForm, setRatingForm] = useState<RatingFormData>({
    rating: 0,
    comment: "",
    orderId: "",
    providerName: "",
    serviceType: "",
  })

  const [ratings] = useState<Rating[]>([
    {
      id: "1",
      orderId: "ORD-001",
      clientName: "Maria Santos",
      providerName: "João Silva",
      rating: 5,
      comment: "Excelente trabalho! Muito profissional e pontual. Recomendo!",
      date: "2024-01-13",
      serviceType: "Instalação elétrica",
    },
    {
      id: "2",
      orderId: "ORD-002",
      clientName: "Carlos Lima",
      providerName: "Ana Costa",
      rating: 4,
      comment: "Bom serviço, chegou no horário e fez um trabalho limpo.",
      date: "2024-01-12",
      serviceType: "Limpeza residencial",
    },
    {
      id: "3",
      orderId: "ORD-003",
      clientName: "Fernanda Souza",
      providerName: "Pedro Oliveira",
      rating: 3,
      comment: "Serviço ok, mas demorou mais que o esperado.",
      date: "2024-01-10",
      serviceType: "Pintura",
    },
  ])

  const [payments] = useState<Payment[]>([
    {
      id: "PAY-001",
      orderId: "ORD-001",
      amount: 150,
      status: "completed",
      method: "credit_card",
      date: "2024-01-13",
      clientName: "Maria Santos",
      providerName: "João Silva",
      serviceType: "Instalação elétrica",
      platformFee: 7.5,
      providerAmount: 142.5,
    },
    {
      id: "PAY-002",
      orderId: "ORD-002",
      amount: 120,
      status: "processing",
      method: "pix",
      date: "2024-01-14",
      dueDate: "2024-01-16",
      clientName: "Carlos Lima",
      providerName: "Ana Costa",
      serviceType: "Limpeza residencial",
      platformFee: 6,
      providerAmount: 114,
    },
    {
      id: "PAY-003",
      orderId: "ORD-003",
      amount: 200,
      status: "pending",
      method: "bank_transfer",
      date: "2024-01-15",
      dueDate: "2024-01-17",
      clientName: "Fernanda Souza",
      providerName: "Pedro Oliveira",
      serviceType: "Pintura",
      platformFee: 10,
      providerAmount: 190,
    },
    {
      id: "PAY-004",
      orderId: "ORD-004",
      amount: 80,
      status: "failed",
      method: "credit_card",
      date: "2024-01-11",
      clientName: "Roberto Costa",
      providerName: "Carlos Lima",
      serviceType: "Reparo encanamento",
      platformFee: 4,
      providerAmount: 76,
    },
  ])

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "processing":
        return "Processando"
      case "pending":
        return "Pendente"
      case "failed":
        return "Falhou"
      case "refunded":
        return "Reembolsado"
      default:
        return status
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

  const handleSubmitRating = () => {
    // In real app, this would call an API
    console.log("Submitting rating:", ratingForm)
    setShowRatingForm(false)
    setRatingForm({
      rating: 0,
      comment: "",
      orderId: "",
      providerName: "",
      serviceType: "",
    })
  }

  const handleRetryPayment = (paymentId: string) => {
    // In real app, this would call an API to retry payment
    console.log("Retrying payment:", paymentId)
  }

  const handleRefundPayment = (paymentId: string) => {
    // In real app, this would call an API to process refund
    console.log("Processing refund:", paymentId)
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "fill-current text-yellow-500" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const filteredRatings =
    userRole === "admin"
      ? ratings
      : userRole === "provider"
        ? ratings.filter((r) => r.providerName === "João Silva") // Mock current provider
        : ratings.filter((r) => r.clientName === "Maria Santos") // Mock current client

  const filteredPayments =
    userRole === "admin"
      ? payments
      : userRole === "provider"
        ? payments.filter((p) => p.providerName === "João Silva") // Mock current provider
        : payments.filter((p) => p.clientName === "Maria Santos") // Mock current client

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "provider"
                ? "Avaliação Média"
                : userRole === "client"
                  ? "Avaliações Dadas"
                  : "Avaliações Totais"}
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              {userRole === "provider" ? (
                <>
                  4.8 <Star className="h-5 w-5 fill-current text-yellow-500" />
                </>
              ) : (
                filteredRatings.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">{userRole === "provider" ? "156 avaliações" : "Este mês"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredPayments.filter((p) => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando processamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredPayments.filter((p) => p.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "provider" ? "Receita Total" : "Gasto Total"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R${" "}
              {filteredPayments
                .filter((p) => p.status === "completed")
                .reduce((sum, p) => sum + (userRole === "provider" ? p.providerAmount : p.amount), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Avaliações e Pagamentos</CardTitle>
              <CardDescription>Gerencie avaliações e acompanhe pagamentos</CardDescription>
            </div>
            {userRole === "client" && (
              <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Star className="h-4 w-4 mr-2" />
                    Avaliar Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Avaliar Prestador</DialogTitle>
                    <DialogDescription>Compartilhe sua experiência para ajudar outros usuários</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Pedido</Label>
                      <Select
                        value={ratingForm.orderId}
                        onValueChange={(value) => setRatingForm({ ...ratingForm, orderId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o pedido" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORD-001">ORD-001 - Instalação elétrica</SelectItem>
                          <SelectItem value="ORD-002">ORD-002 - Limpeza residencial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Avaliação</Label>
                      <div className="mt-2">
                        {renderStars(ratingForm.rating, true, (rating) => setRatingForm({ ...ratingForm, rating }))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Comentário</Label>
                      <Textarea
                        id="comment"
                        placeholder="Descreva sua experiência..."
                        value={ratingForm.comment}
                        onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRatingForm(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmitRating} disabled={ratingForm.rating === 0}>
                      Enviar Avaliação
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Ratings Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Avaliações Recentes</h3>
              <div className="space-y-4">
                {filteredRatings.map((rating) => (
                  <div key={rating.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {(userRole === "provider" ? rating.clientName : rating.providerName)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {userRole === "provider" ? rating.clientName : rating.providerName}
                            </p>
                            <p className="text-sm text-muted-foreground">{rating.serviceType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(rating.rating)}
                          <span className="text-sm text-muted-foreground">({rating.rating}/5)</span>
                        </div>
                        <p className="text-sm">{rating.comment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{rating.date}</p>
                        <Badge variant="outline">#{rating.orderId}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Payments Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h3>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">#{payment.orderId}</h4>
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {getPaymentStatusText(payment.status)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{payment.serviceType}</p>
                          <p>
                            {userRole === "provider"
                              ? `Cliente: ${payment.clientName}`
                              : `Prestador: ${payment.providerName}`}
                          </p>
                          <p>Método: {getPaymentMethodText(payment.method)}</p>
                          <p>Data: {payment.date}</p>
                          {payment.dueDate && <p>Vencimento: {payment.dueDate}</p>}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="space-y-1">
                          <p className="text-xl font-bold text-primary">
                            R$ {userRole === "provider" ? payment.providerAmount.toFixed(2) : payment.amount.toFixed(2)}
                          </p>
                          {userRole === "provider" && (
                            <p className="text-xs text-muted-foreground">Taxa: R$ {payment.platformFee.toFixed(2)}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {payment.status === "failed" && (
                            <Button size="sm" variant="outline" onClick={() => handleRetryPayment(payment.id)}>
                              <CreditCard className="h-4 w-4 mr-1" />
                              Tentar novamente
                            </Button>
                          )}
                          {payment.status === "completed" && userRole === "admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRefundPayment(payment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reembolsar
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                                <Receipt className="h-4 w-4 mr-1" />
                                Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalhes do Pagamento</DialogTitle>
                              </DialogHeader>
                              {selectedPayment && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>ID do Pagamento</Label>
                                      <p className="font-medium">{selectedPayment.id}</p>
                                    </div>
                                    <div>
                                      <Label>Pedido</Label>
                                      <p className="font-medium">{selectedPayment.orderId}</p>
                                    </div>
                                    <div>
                                      <Label>Valor Total</Label>
                                      <p className="font-medium">R$ {selectedPayment.amount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <Label>Taxa da Plataforma</Label>
                                      <p className="font-medium">R$ {selectedPayment.platformFee.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <Label>Valor do Prestador</Label>
                                      <p className="font-medium">R$ {selectedPayment.providerAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <Label>Método de Pagamento</Label>
                                      <p className="font-medium">{getPaymentMethodText(selectedPayment.method)}</p>
                                    </div>
                                  </div>
                                  {selectedPayment.status === "failed" && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                        <div>
                                          <p className="font-medium text-red-800">Pagamento Falhou</p>
                                          <p className="text-sm text-red-700">
                                            Verifique os dados do cartão ou tente outro método de pagamento.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
