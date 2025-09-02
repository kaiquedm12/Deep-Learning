"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Star, SlidersHorizontal, MessageCircle, CheckCircle } from "lucide-react"

interface ServiceCategory {
  id: string
  nome: string
  descricao?: string
  _count: {
    services: number
    prestadores: number
  }
}

interface Service {
  id: string
  nome: string
  descricao: string
  preco: number
  category: {
    id: string
    nome: string
  }
  orders: Array<{
    prestador: {
      id: string
      user: {
        name: string
      }
      avaliacaoMedia: number | null
      totalAvaliacoes: number
    }
  }>
}

interface SearchFilters {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  location: string
}

export default function ServiceSearch() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
  })

  // Carregar categorias na inicialização
  useEffect(() => {
    fetchCategories()
    fetchServices()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/services/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    }
  }

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/services?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchServices()
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
    })
  }

  const getProviderInfo = (service: Service) => {
    if (service.orders.length > 0) {
      const provider = service.orders[0].prestador
      return {
        name: provider.user.name,
        rating: provider.avaliacaoMedia || 0,
        totalReviews: provider.totalAvaliacoes,
      }
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Buscar Serviços
          </CardTitle>
          <CardDescription>Encontre o prestador ideal para suas necessidades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="O que você precisa? Ex: Eletricista, Encanador..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Buscando..." : "Buscar"}
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Categoria</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nome} ({category._count.services})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preço mínimo</Label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
              </div>

              <div>
                <Label>Preço máximo</Label>
                <Input
                  type="number"
                  placeholder="R$ 1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>

              <div>
                <Label>Localização</Label>
                <Input
                  placeholder="Cidade ou bairro"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>

              <div className="md:col-span-4 flex gap-2">
                <Button onClick={handleSearch} size="sm">
                  Aplicar Filtros
                </Button>
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Quick Access */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 6).map((category) => (
          <Button
            key={category.id}
            variant={filters.category === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              handleFilterChange("category", category.id)
              fetchServices()
            }}
          >
            {category.nome}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{services.length} serviços encontrados</h3>
        </div>

        {services.length === 0 && !loading && (
          <Card>
            <CardContent className="py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outros termos</p>
            </CardContent>
          </Card>
        )}

        {services.map((service) => {
          const providerInfo = getProviderInfo(service)

          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">{service.nome}</h4>
                        <Badge variant="outline">{service.category.nome}</Badge>
                      </div>
                      <p className="text-muted-foreground">{service.descricao}</p>
                    </div>

                    {providerInfo && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {providerInfo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{providerInfo.name}</span>
                        </div>

                        {providerInfo.totalReviews > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="font-medium">{providerInfo.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({providerInfo.totalReviews} avaliações)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right space-y-3">
                    <div className="text-2xl font-bold text-primary">R$ {service.preco.toFixed(2)}</div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Contratar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
