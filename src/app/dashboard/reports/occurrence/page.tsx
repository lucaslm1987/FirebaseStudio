'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Calendar as CalendarIcon, Search, Printer, AlertTriangle, Trash2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { OccurrenceFormData, InvolvedPerson } from './new/form-context';
import { Step6Review } from './new/steps/step6-review';

type Report = OccurrenceFormData & { id: string };

const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export default function ConsultOccurrenceReportPage() {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  
  const [reportId, setReportId] = useState('');
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [isPrintModalOpen, setPrintModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  useEffect(() => {
    try {
      const savedReportsString = localStorage.getItem('occurrenceReports');
      const savedReports: Report[] = savedReportsString ? JSON.parse(savedReportsString) : [];
      savedReports.sort((a, b) => {
        const dateA = a.factDate ? new Date(`${a.factDate}T${a.factTime || '00:00'}`).getTime() : 0;
        const dateB = b.factDate ? new Date(`${b.factDate}T${b.factTime || '00:00'}`).getTime() : 0;
        return dateB - dateA;
      });
      setAllReports(savedReports);
      setFilteredReports(savedReports);
    } catch (error) {
      console.error("Failed to load reports from localStorage", error);
    }
  }, []);

  const handleSearch = () => {
    let results = allReports;

    if (startDate) {
      results = results.filter(report => {
        if (!report.factDate) return false;
        return new Date(report.factDate) >= startDate;
      });
    }

    if (endDate) {
      results = results.filter(report => {
        if (!report.factDate) return false;
        const reportDate = new Date(report.factDate);
        reportDate.setHours(0,0,0,0);
        const searchEndDate = new Date(endDate);
        searchEndDate.setHours(23,59,59,999);
        return reportDate <= searchEndDate;
      });
    }

    if (reportId) {
      results = results.filter(report => report.id.toLowerCase().includes(reportId.toLowerCase()));
    }
    
    if (cpf) {
      results = results.filter(report => 
        report.involved.some(inv => inv.type === 'person' && (inv as InvolvedPerson).cpf === cpf)
      );
    }

    if (name) {
      results = results.filter(report => 
        report.involved.some(inv => 
          (inv.type === 'person' && inv.name.toLowerCase().includes(name.toLowerCase())) ||
          (inv.type === 'company' && inv.corporateName.toLowerCase().includes(name.toLowerCase()))
        )
      );
    }

    setFilteredReports(results);
  };
  
  const handlePrint = (report: Report) => {
    setSelectedReport(report);
    setPrintModalOpen(true);
    setTimeout(() => {
        window.print();
    }, 500);
  }

  const handleClearStorage = () => {
    if (window.confirm("Tem certeza que deseja apagar todos os BOs de teste? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem('occurrenceReports');
      window.location.reload();
    }
  }

  return (
    <>
    <Dialog open={isPrintModalOpen} onOpenChange={setPrintModalOpen}>
        <DialogContent className="max-w-4xl printable-content-only p-0 border-0">
            {selectedReport && <Step6Review formData={selectedReport} />}
        </DialogContent>
    </Dialog>

    <div className="flex h-full flex-col print:hidden">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Consultar Boletins de Ocorrência
        </h1>
        <Button variant="destructive" size="sm" onClick={handleClearStorage}>
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Registros de Teste
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtrar Boletins de Ocorrência</CardTitle>
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
                        <Input id="bo-id" placeholder="Ex: BO2024001" value={reportId} onChange={e => setReportId(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cpf">CPF do Envolvido</Label>
                        <Input 
                            id="cpf" 
                            placeholder="000.000.000-00" 
                            value={cpf}
                            onChange={(e) => setCpf(maskCPF(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Envolvido</Label>
                        <Input id="name" placeholder="Nome do envolvido" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                 <div className="mt-4 flex justify-end">
                    <Button onClick={handleSearch}>
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
                    <TableHead>Natureza</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.factDate ? `${format(new Date(report.factDate), 'dd/MM/yyyy')} ${report.factTime || ''}`: 'N/A'}</TableCell>
                        <TableCell className="max-w-[250px] truncate">{report.nature || 'N/A'}</TableCell>
                        <TableCell className="max-w-[250px] truncate">{`${report.street || ''}, ${report.number || ''}`}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handlePrint(report)}>
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Imprimir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-8 w-8" />
                            <p>Nenhum resultado encontrado.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
}
