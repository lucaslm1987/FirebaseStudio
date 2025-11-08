
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Search, Printer } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};


export default function ConsultOccurrenceReportPage() {
  const [cpf, setCpf] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const reports = [
    {
      id: 'BO2024001',
      date: '2024-07-28 10:30',
      location: 'Av. Paulista, 1578',
      status: 'Em andamento',
    },
    {
      id: 'BO2024002',
      date: '2024-07-27 22:15',
      location: 'Rua Augusta, 900',
      status: 'Finalizado',
    },
    {
      id: 'BO2024003',
      date: '2024-07-27 14:00',
      location: 'Pq. Ibirapuera, Portão 3',
      status: 'Finalizado',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Consultar Boletins de Ocorrência
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultar Boletins de Ocorrência</CardTitle>
            <CardDescription>
              Utilize os filtros abaixo para pesquisar os BOs registrados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md border bg-muted/50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Data Inicial</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">Data Final</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bo-id">Nº do BO</Label>
                        <Input id="bo-id" placeholder="Ex: BO2024001" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input 
                            id="cpf" 
                            placeholder="000.000.000-00" 
                            value={cpf}
                            onChange={(e) => setCpf(maskCPF(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" placeholder="Nome do envolvido" />
                    </div>
                </div>
                 <div className="mt-4 flex justify-end">
                    <Button>
                        <Search className="mr-2 h-4 w-4" />
                        Pesquisar
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'Finalizado'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Imprimir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
