
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Printer, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ServiceReportData } from './new/page';


export default function ConsultServiceReportPage() {
  const [allReports, setAllReports] = useState<ServiceReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<ServiceReportData[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  useEffect(() => {
    try {
      const savedReportsString = localStorage.getItem('serviceReports');
      const savedReports: ServiceReportData[] = savedReportsString ? JSON.parse(savedReportsString) : [];
      savedReports.sort((a, b) => {
        const dateA = a.openingDate ? new Date(`${a.openingDate}T${a.openingTime || '00:00'}`).getTime() : 0;
        const dateB = b.openingDate ? new Date(`${b.openingDate}T${b.openingTime || '00:00'}`).getTime() : 0;
        return dateB - dateA;
      });
      setAllReports(savedReports);
      setFilteredReports(savedReports);
    } catch (error) {
      console.error("Failed to load service reports from localStorage", error);
    }
  }, []);

  const handleSearch = () => {
    let results = allReports;

    if (startDate) {
      results = results.filter(report => {
        if (!report.openingDate) return false;
        const reportDate = new Date(report.openingDate);
        reportDate.setHours(0,0,0,0);
        return reportDate >= startDate;
      });
    }

    if (endDate) {
      results = results.filter(report => {
        if (!report.openingDate) return false;
        const reportDate = new Date(report.openingDate);
        reportDate.setHours(0,0,0,0);
        const searchEndDate = new Date(endDate);
        searchEndDate.setHours(23,59,59,999);
        return reportDate <= searchEndDate;
      });
    }
    
    setFilteredReports(results);
  };


  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
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
            <div className="rounded-md border bg-muted/50 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy') : <span>Selecione a data</span>}
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
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy') : <span>Selecione a data</span>}
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
                 <div className="space-y-2 self-end">
                    <Button className='w-full' onClick={handleSearch}>
                      <Search className="mr-2 h-4 w-4" />
                      Pesquisar
                    </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.openingDate ? format(new Date(`${report.openingDate}T00:00:00`), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
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
                            <p>Nenhum relatório encontrado.</p>
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
  );
}

    