
'use client';

import { useState } from 'react';
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
import QRCode from 'react-qr-code';
import { Printer, Share2 } from 'lucide-react';

export default function NewOccurrenceReportPage() {
  const [reportId, setReportId] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newReportId = `BO${Date.now()}`;
    setReportId(newReportId);
  };

  const handlePrint = () => {
    window.print();
  };

  const consultationUrl = reportId
    ? `${window.location.origin}/dashboard/reports/occurrence/consult?id=${reportId}`
    : '';

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-6 print:hidden">
        <SidebarTrigger className="md:hidden" />
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Criar Boletim de Ocorrência
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          {!reportId ? (
            <>
              <CardHeader>
                <CardTitle>Novo Boletim de Ocorrência</CardTitle>
                <CardDescription>
                  Preencha os campos abaixo para registrar um novo BO.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data e Hora</Label>
                      <Input id="date" type="datetime-local" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Local da Ocorrência</Label>
                      <Input
                        id="location"
                        placeholder="Endereço completo"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="involved">Envolvidos</Label>
                    <Textarea
                      id="involved"
                      placeholder="Nomes, documentos e tipo de envolvimento"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição dos Fatos</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente a ocorrência"
                      rows={6}
                      required
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
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle>Ocorrência Registrada com Sucesso</CardTitle>
                <CardDescription>
                  Utilize o QR Code abaixo para consultar ou compartilhar os
                  detalhes.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <QRCode value={consultationUrl} size={200} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  ID do Relatório: {reportId}
                </p>
                <div className="flex w-full max-w-sm flex-col gap-2 print:hidden sm:flex-row">
                  <Button
                    onClick={handlePrint}
                    className="w-full"
                    variant="outline"
                  >
                    <Printer className="mr-2" />
                    Imprimir
                  </Button>
                  <Button
                    onClick={() => setReportId(null)}
                    className="w-full"
                  >
                    Criar Novo BO
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
