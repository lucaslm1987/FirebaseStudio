
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Printer,
  Check,
  FileText,
  Users,
  Scale,
  BookText,
  Package,
  XCircle,
  Save,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  OccurrenceFormProvider,
  useOccurrenceForm,
  type OccurrenceFormData,
} from './form-context';
import { Step1GeneralData } from './steps/step1-general-data';
import { Step2Nature } from './steps/step2-nature';
import { Step3Involved } from './steps/step3-involved';
import { Step4Items } from './steps/step4-items';
import { Step5Narrative } from './steps/step5-narrative';
import { Step6Review } from './steps/step6-review';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

// Helper function to clean data for Firestore
const cleanDataForFirestore = (data: any): any => {
    if (data === undefined) {
        return null;
    }
    if (Array.isArray(data)) {
        return data.map(item => cleanDataForFirestore(item));
    }
    if (data !== null && typeof data === 'object' && !(data instanceof Date) && !(data instanceof Timestamp)) {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                // Retain the field as null if it's explicitly set to that, otherwise skip undefined
                if (value !== undefined) {
                    newData[key] = cleanDataForFirestore(value);
                }
            }
        }
        return newData;
    }
    // Convert empty string to null, but allow 0
    if (data === '') {
        return null;
    }
    return data;
};

const steps = [
  { id: 1, name: 'Dados Gerais', icon: FileText },
  { id: 2, name: 'Natureza da Ocorrência', icon: Scale },
  { id: 3, name: 'Envolvidos', icon: Users },
  { id: 4, name: 'Veículos/Objetos', icon: Package },
  { id: 5, name: 'Narrativa', icon: BookText },
  { id: 6, name: 'Revisão e Encerramento', icon: Check },
];

function NewOccurrenceReportContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { formData, resetForm } = useOccurrenceForm();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);


  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/dashboard');
    }
  };
  
  const handleSaveReport = () => {
    if (!formData || !firestore || !user) {
        toast({
            variant: "destructive",
            title: "Erro: Usuário não autenticado",
            description: "Não foi possível identificar o usuário. Tente fazer login novamente.",
        });
        return;
    }
    try {
      const dataToSave = {
          ...formData,
          userId: user.uid, // Add the user ID to the data
          createdAt: serverTimestamp(),
      };
      const cleanedData = cleanDataForFirestore(dataToSave);
      const reportDocRef = doc(firestore, 'occurrence_reports', cleanedData.id);

      setDocumentNonBlocking(reportDocRef, cleanedData, { merge: true });

      setCurrentStep(7); 
    } catch (error) {
      console.error("Failed to prepare report for saving:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Ocorreu um erro ao preparar os dados do relatório.",
      });
    }
  };
  

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        const printContent = document.getElementById('printable-content')?.innerHTML;
        if (printContent) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Imprimir Boletim de Ocorrência</title>
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
    }
  };

  const handleNewReport = () => {
    resetForm();
    setCurrentStep(1);
  };
  
  const handleClearForm = () => {
    setIsClearAlertOpen(true);
  }

  const confirmClearForm = () => {
    resetForm();
    setIsClearAlertOpen(false);
  }

  if (!formData || formData.id === 'Loading...') {
    return (
        <div className="flex h-full items-center justify-center">
            <p>Carregando formulário...</p>
        </div>
    )
  }
  
  const RenderedReview = <Step6Review formData={formData} />;

  return (
    <>
      <AlertDialog open={isClearAlertOpen} onOpenChange={setIsClearAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados do formulário
              serão permanentemente apagados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearForm}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex h-full flex-col">
        <div id="printable-content" className="hidden print:block">{RenderedReview}</div>

        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-transparent px-6 print:hidden">
          <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
            Criar Boletim de Ocorrência
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
              Nº: {formData.id}
          </p>
          <Button variant="outline" size="sm" onClick={handleClearForm}>
              <XCircle className="mr-2 h-4 w-4" />
              Limpar Formulário
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 print:hidden">
          <div className="mx-auto max-w-5xl">
            {/* Stepper */}
            {currentStep <= 6 && (
              <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          currentStep > step.id
                            ? 'border-green-500 bg-green-500 text-white'
                            : currentStep === step.id
                            ? 'border-primary'
                            : 'border-border'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check size={20} />
                        ) : (
                          <step.icon size={20} />
                        )}
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-px w-full md:flex-1 md:h-auto md:w-auto border-t-2 ${
                          currentStep > index + 1
                            ? 'border-green-500'
                            : 'border-border'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <Card>
              <CardContent className="p-0">
                  <div className='p-6'>
                      {currentStep === 1 && <Step1GeneralData />}
                      {currentStep === 2 && <Step2Nature />}
                      {currentStep === 3 && <Step3Involved />}
                      {currentStep === 4 && <Step4Items />}
                      {currentStep === 5 && <Step5Narrative />}
                  </div>

                  {currentStep === 6 && (
                      <div className="p-6">
                          {RenderedReview}
                      </div>
                  )}
                
                  {currentStep === 7 && (
                      <div className="text-center p-6">
                      <h2 className="mb-2 text-2xl font-bold">
                          Ocorrência Salva com Sucesso
                      </h2>
                      <p className="mb-6 text-muted-foreground">
                          ID do Relatório: {formData.id}
                      </p>
                      <div className="flex flex-col items-center gap-6">
                          <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
                          <Button onClick={() => router.push('/dashboard/reports/occurrence')} className="w-full" variant="outline">
                              Consultar BOs
                          </Button>
                          <Button onClick={handleNewReport} className="w-full">
                              Criar Novo BO
                          </Button>
                          </div>
                      </div>
                      </div>
                )}

                {currentStep < 6 && (
                  <div className="mt-8 flex justify-between p-6 border-t">
                    <Button variant="outline" onClick={handleBack}>
                      {currentStep === 1 ? 'Cancelar' : 'Voltar'}
                    </Button>
                    <Button onClick={handleNext}>
                      {'Avançar'}
                    </Button>
                  </div>
                )}
                {currentStep === 6 && (
                  <div className="mt-8 flex justify-between p-6 border-t">
                    <Button variant="outline" onClick={handleBack}>
                      Voltar
                    </Button>
                    <div className='flex gap-2'>
                      <Button variant="secondary" onClick={handlePrint}>
                          <Printer className="mr-2 h-4 w-4" />
                          Gerar PDF
                      </Button>
                      <Button onClick={handleSaveReport}>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}


export default function NewOccurrenceReportPage() {
    return (
        <OccurrenceFormProvider>
            <NewOccurrenceReportContent />
        </OccurrenceFormProvider>
    )
}
