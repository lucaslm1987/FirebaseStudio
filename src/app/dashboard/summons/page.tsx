
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
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function ConsultSummonsPage() {
  const summonses = [
    {
      id: 'TA2024-051',
      date: '2024-07-28 15:00',
      target: 'Veículo ABC-1234',
      status: 'Pendente',
    },
    {
      id: 'TA2024-050',
      date: '2024-07-26 11:20',
      target: 'João da Silva',
      status: 'Pago',
    },
    {
      id: 'TA2024-049',
      date: '2024-07-25 09:05',
      target: 'Veículo XYZ-5678',
      status: 'Cancelado',
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Consultar Talões
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultar Talões</CardTitle>
            <CardDescription>
              Pesquise e visualize os talões emitidos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por ID, pessoa ou veículo..."
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
                    <TableHead>Autuado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summonses.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.id}</TableCell>
                      <TableCell>{s.date}</TableCell>
                      <TableCell>{s.target}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            s.status === 'Pendente'
                              ? 'default'
                              : s.status === 'Pago'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {s.status}
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
