
'use client';

import { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
import { Search, Printer, Calendar as CalendarIcon, AlertTriangle, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ServiceReportData } from './new/page';
import { ServiceReportPrint } from './service-report-print';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


export default function ConsultServiceReportPage() {
  const firestore = useFirestore();
  const reportsCollection = useMemoFirebase(() => collection(firestore, 'service_reports'), [firestore]);
  const { data: allReports, isLoading } = useCollection<ServiceReportData>(reportsCollection);
  
  const [filteredReports, setFilteredReports] = useState<ServiceReportData[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  useEffect(() => {
    if (allReports) {
      const sorted = [...allReports].sort((a, b) => {
        const dateA = a.openingDate ? new Date(`${a.openingDate}T${a.openingTime || '00:00'}`).getTime() : 0;
        const dateB = b.openingDate ? new Date(`${b.openingDate}T${b.openingTime || '00:00'}`).getTime() : 0;
        return dateB - dateA;
      });
      setFilteredReports(sorted);
    }
  }, [allReports]);

  const handleSearch = () => {
    if (!allReports) return;
    let results = allReports;

    if (startDate) {
      results = results.filter(report => {
        if (!report.openingDate) return false;
        const reportDate = new Date(report.openingDate);
        reportDate.setUTCHours(0, 0, 0, 0);
        const filterStartDate = new Date(startDate);
        filterStartDate.setUTCHours(0, 0, 0, 0);
        return reportDate >= filterStartDate;
      });
    }
  
    if (endDate) {
      results = results.filter(report => {
        if (!report.openingDate) return false;
        const reportDate = new Date(report.openingDate);
        reportDate.setUTCHours(0, 0, 0, 0);
        const filterEndDate = new Date(endDate);
        filterEndDate.setUTCHours(0, 0, 0, 0);
        return reportDate <= filterEndDate;
      });
    }
    
    setFilteredReports(results);
  };
  
  const handlePrint = (report: ServiceReportData) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        const printContent = ReactDOMServer.renderToString(<ServiceReportPrint reportData={report} />);
        printWindow.document.write(`
            <html>
                <head>
                    <title>Imprimir Relatório de Serviço</title>
                    <link rel="stylesheet" href="/print-styles.css">
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
    }
  };

  const handleSave = async (report: ServiceReportData) => {
    const reportHtml = ReactDOMServer.renderToString(<ServiceReportPrint reportData={report} />);
    const tempContainer = document.createElement('div');
    // Set a fixed width to simulate A4 paper and control the layout
    tempContainer.style.width = '210mm';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.innerHTML = reportHtml;
    
    try {
        const printStyles = await fetch('/print-styles.css').then(res => res.text());
        const styleEl = document.createElement('style');
        styleEl.innerHTML = printStyles;
        tempContainer.querySelector('.print-container')?.prepend(styleEl);

        document.body.appendChild(tempContainer);
        
        const printableElement = tempContainer.querySelector('.print-container') as HTMLElement;

        const canvas = await html2canvas(printableElement, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        
        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageTotalWidth = pdf.internal.pageSize.getWidth();
        const pageTotalHeight = pdf.internal.pageSize.getHeight();
        const scale = 0.8;
        
        const pdfWidth = pageTotalWidth * scale;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        const x = (pageTotalWidth - pdfWidth) / 2;
        const y = (pageTotalHeight - pdfHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, pdfWidth, pdfHeight);
        pdf.save(`${report.id}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Não foi possível gerar o PDF. Verifique o console para mais detalhes.")
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer); // Ensure cleanup on error
        }
    }
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
                  {isLoading && <TableRow><TableCell colSpan={2} className="h-24 text-center">Carregando...</TableCell></TableRow>}
                  {!isLoading && filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.openingDate ? format(new Date(`${report.openingDate}T00:00:00`), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleSave(report)}>
                            <Save className="h-4 w-4" />
                            <span className="sr-only">Salvar</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handlePrint(report)}>
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Imprimir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     !isLoading && <TableRow>
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
