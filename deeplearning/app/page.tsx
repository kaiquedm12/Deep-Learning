import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">ServiceHub</h1>
            <Badge variant="secondary">Marketplace</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Conectamos você aos melhores prestadores de serviços
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Encontre profissionais qualificados para seus projetos ou ofereça seus serviços para milhares de clientes em
            potencial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=cliente">
              <Button size="lg" className="w-full sm:w-auto">
                Contratar Serviços
              </Button>
            </Link>
            <Link href="/auth/register?type=prestador">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Oferecer Serviços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Por que escolher o ServiceHub?</h3>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Busca Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Encontre prestadores por localização, categoria e avaliações de outros clientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Segurança Garantida</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Todos os prestadores são verificados e os pagamentos são protegidos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Avaliações Reais</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Sistema de avaliações transparente para garantir a qualidade dos serviços.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Pronto para começar?</h3>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de usuários que já confiam no ServiceHub
          </p>

          <Link href="/auth/register">
            <Button size="lg">Criar Conta Gratuita</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 ServiceHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
