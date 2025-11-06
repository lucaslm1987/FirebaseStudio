
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
import { Search, Printer } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function ConsultServiceReportPage() {
  const reports = [
    { id: 'RSD20240728', date: '2024-07-28', team: 'GCM Silva, GCM Santos' },
    { id: 'RSD20240727', date: '2024-07-27', team: 'GCM Lima, GCM Costa' },
    { id: 'RSD20240726', date: '2024-07-26', team: 'GCM Pereira, GCM Oliveira' },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Consultar Relatórios de Serviço
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultar Relatórios de Serviço</CardTitle>
            <CardDescription>
              Pesquise e visualize os relatórios diários.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por data ou equipe..."
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
                    <TableHead>Data</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.team}</TableCell>
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
