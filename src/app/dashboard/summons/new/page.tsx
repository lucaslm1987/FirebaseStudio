
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewSummonsPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Criar Talão
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Talão</CardTitle>
            <CardDescription>
              Preencha os campos para emitir um novo talão.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Data e Hora</Label>
                  <Input id="date" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input id="location" placeholder="Endereço da infração" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="person-vehicle">Pessoa / Veículo</Label>
                <Input
                  id="person-vehicle"
                  placeholder="Nome do autuado ou placa do veículo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="infraction">Descrição da Infração</Label>
                <Textarea
                  id="infraction"
                  placeholder="Descreva a infração cometida"
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit">Emitir Talão</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
