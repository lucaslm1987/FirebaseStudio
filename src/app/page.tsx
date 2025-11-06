
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold">
              GCMobile
            </CardTitle>
            <CardDescription>
              Acesso restrito. Insira seu identificador para receber um código de
              acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/dashboard" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier">Identificador (matrícula)</Label>
                <Input
                  id="identifier"
                  placeholder="Sua matrícula funcional"
                  required
                  type="text"
                />
              </div>
              <Button className="w-full" type="button" variant="secondary">
                Receber código
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ou insira seu código
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access-code">Código de Acesso</Label>
                <Input id="access-code" placeholder="Código recebido" required />
              </div>
              <Button className="w-full">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
