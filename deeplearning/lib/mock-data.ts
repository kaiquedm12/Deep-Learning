export interface ServiceCategory {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export interface Service {
  id: string
  nome: string
  descricao: string
  preco: number
  categoryId: string
  category: ServiceCategory
  providerId: string
  providerName: string
  rating: number
  totalReviews: number
}

export interface Order {
  id: string
  clienteId: string
  clienteName: string
  prestadorId?: string
  prestadorName?: string
  serviceId: string
  serviceName: string
  descricao: string
  endereco: string
  dataServico?: string
  preco: number
  status: "AGUARDANDO" | "MATCHING" | "AGENDADO" | "CONCLUIDO" | "CANCELADO"
  createdAt: string
  rating?: number
  review?: string
}

export interface Payment {
  id: string
  orderId: string
  valor: number
  taxa: number
  status: "PENDENTE" | "PAGO" | "REEMBOLSADO" | "CANCELADO"
  metodoPagamento?: string
  transactionId?: string
  createdAt: string
}

export interface Address {
  id: string
  nome: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  principal: boolean
}

// Categorias de serviços
export const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: "1", nome: "Limpeza", descricao: "Serviços de limpeza residencial e comercial", ativo: true },
  { id: "2", nome: "Elétrica", descricao: "Instalações e reparos elétricos", ativo: true },
  { id: "3", nome: "Encanamento", descricao: "Serviços hidráulicos e encanamento", ativo: true },
  { id: "4", nome: "Pintura", descricao: "Pintura residencial e comercial", ativo: true },
  { id: "5", nome: "Jardinagem", descricao: "Cuidados com jardins e plantas", ativo: true },
  { id: "6", nome: "Marcenaria", descricao: "Móveis sob medida e reparos", ativo: true },
]

// Serviços disponíveis
export const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    nome: "Limpeza Completa Residencial",
    descricao: "Limpeza completa de casa ou apartamento, incluindo todos os cômodos",
    preco: 150,
    categoryId: "1",
    category: MOCK_CATEGORIES[0],
    providerId: "2",
    providerName: "João Silva",
    rating: 4.8,
    totalReviews: 127,
  },
  {
    id: "2",
    nome: "Instalação Elétrica",
    descricao: "Instalação de pontos elétricos, tomadas e interruptores",
    preco: 200,
    categoryId: "2",
    category: MOCK_CATEGORIES[1],
    providerId: "2",
    providerName: "João Silva",
    rating: 4.9,
    totalReviews: 89,
  },
  {
    id: "3",
    nome: "Reparo de Vazamentos",
    descricao: "Identificação e reparo de vazamentos em tubulações",
    preco: 120,
    categoryId: "3",
    category: MOCK_CATEGORIES[2],
    providerId: "4",
    providerName: "Carlos Mendes",
    rating: 4.7,
    totalReviews: 156,
  },
  {
    id: "4",
    nome: "Pintura de Parede",
    descricao: "Pintura de paredes internas e externas com tinta de qualidade",
    preco: 80,
    categoryId: "4",
    category: MOCK_CATEGORIES[3],
    providerId: "5",
    providerName: "Ana Costa",
    rating: 4.6,
    totalReviews: 203,
  },
]

// Pedidos de exemplo
export const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    clienteId: "3",
    clienteName: "Maria Santos",
    prestadorId: "2",
    prestadorName: "João Silva",
    serviceId: "1",
    serviceName: "Limpeza Completa Residencial",
    descricao: "Preciso de limpeza completa do apartamento de 2 quartos",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    dataServico: "2024-01-15T14:00:00Z",
    preco: 150,
    status: "CONCLUIDO",
    createdAt: "2024-01-10T10:00:00Z",
    rating: 5,
    review: "Excelente serviço, muito profissional!",
  },
  {
    id: "2",
    clienteId: "3",
    clienteName: "Maria Santos",
    prestadorId: "2",
    prestadorName: "João Silva",
    serviceId: "2",
    serviceName: "Instalação Elétrica",
    descricao: "Instalação de 3 tomadas na sala e 2 no quarto",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    dataServico: "2024-01-20T09:00:00Z",
    preco: 200,
    status: "AGENDADO",
    createdAt: "2024-01-12T15:30:00Z",
  },
  {
    id: "3",
    clienteId: "6",
    clienteName: "Pedro Oliveira",
    serviceId: "3",
    serviceName: "Reparo de Vazamentos",
    descricao: "Vazamento no banheiro, urgente",
    endereco: "Av. Paulista, 456 - São Paulo, SP",
    preco: 120,
    status: "AGUARDANDO",
    createdAt: "2024-01-14T08:00:00Z",
  },
]

// Endereços salvos
export const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    nome: "Casa",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    principal: true,
  },
  {
    id: "2",
    nome: "Trabalho",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    principal: false,
  },
]

// Pagamentos
export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "1",
    orderId: "1",
    valor: 150,
    taxa: 7.5,
    status: "PAGO",
    metodoPagamento: "credit_card",
    transactionId: "TXN_123456789",
    createdAt: "2024-01-15T16:00:00Z",
  },
  {
    id: "2",
    orderId: "2",
    valor: 200,
    taxa: 10,
    status: "PENDENTE",
    createdAt: "2024-01-20T10:00:00Z",
  },
]

/**
 * Funções utilitárias para buscar dados mock
 */
export function getServicesByCategory(categoryId?: string): Service[] {
  if (!categoryId) return MOCK_SERVICES
  return MOCK_SERVICES.filter((service) => service.categoryId === categoryId)
}

export function getOrdersByUser(userId: string, role: string): Order[] {
  if (role === "CLIENTE") {
    return MOCK_ORDERS.filter((order) => order.clienteId === userId)
  } else if (role === "PRESTADOR") {
    return MOCK_ORDERS.filter((order) => order.prestadorId === userId)
  }
  return MOCK_ORDERS // Admin vê todos
}

export function getPaymentsByUser(userId: string, role: string): Payment[] {
  const userOrders = getOrdersByUser(userId, role)
  const orderIds = userOrders.map((order) => order.id)
  return MOCK_PAYMENTS.filter((payment) => orderIds.includes(payment.orderId))
}
