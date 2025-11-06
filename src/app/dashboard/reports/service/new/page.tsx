
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

export default function NewServiceReportPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Criar Relatório de Serviço Diário
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Relatório de Serviço Diário</CardTitle>
            <CardDescription>
              Preencha os campos para registrar o serviço do dia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Equipe de Serviço</Label>
                  <Input id="team" placeholder="Nomes dos oficiais" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Viatura</Label>
                <Input id="vehicle" placeholder="Identificação da viatura" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Resumo das Atividades</Label>
                <Textarea
                  id="summary"
                  placeholder="Descreva as principais atividades, rondas e ocorrências atendidas"
                  rows={8}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit">Salvar Relatório</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
