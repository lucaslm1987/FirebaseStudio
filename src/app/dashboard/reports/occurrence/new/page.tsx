
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
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function NewOccurrenceReportPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Criar Boletim de Ocorrência
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Boletim de Ocorrência</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para registrar um novo BO.
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
                  <Label htmlFor="location">Local da Ocorrência</Label>
                  <Input id="location" placeholder="Endereço completo" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="involved">Envolvidos</Label>
                <Textarea
                  id="involved"
                  placeholder="Nomes, documentos e tipo de envolvimento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição dos Fatos</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva detalhadamente a ocorrência"
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit">Salvar Ocorrência</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
