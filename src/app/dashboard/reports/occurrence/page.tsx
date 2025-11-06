
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Printer } from 'lucide-react';

export default function ConsultOccurrenceReportPage() {
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
              Pesquise e visualize os BOs registrados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por ID, local ou data..."
                  className="pl-10"
                />
              </div>
              <Button>Pesquisar</Button>
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
