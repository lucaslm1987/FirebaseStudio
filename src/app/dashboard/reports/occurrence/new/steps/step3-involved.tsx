
'use client';

import { useOccurrenceForm } from '../form-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Building2 } from 'lucide-react';

export function Step3Involved() {
  const { formData, updateField } = useOccurrenceForm();
  
  // Placeholder para a lógica futura
  const handleAddPerson = () => {
    console.log("Adicionar Pessoa Física");
  };

  const handleAddEntity = () => {
    console.log("Adicionar Pessoa Jurídica");
  };

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h3 className="text-lg font-medium">Pessoas Envolvidas</h3>
            <p className="text-muted-foreground text-sm">Adicione as pessoas físicas ou jurídicas relacionadas à ocorrência.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary"/>
                        Pessoa Física
                    </CardTitle>
                    <CardDescription>Para indivíduos como vítimas, testemunhas, autores, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleAddPerson}>
                        Adicionar Pessoa Física
                    </Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary"/>
                        Pessoa Jurídica
                    </CardTitle>
                    <CardDescription>Para empresas, organizações ou outras entidades.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleAddEntity}>
                        Adicionar Pessoa Jurídica
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="mt-8">
            <h4 className="font-medium mb-4">Envolvidos Adicionados:</h4>
            <div className="rounded-md border min-h-[100px] p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">Nenhum envolvido adicionado ainda.</p>
                {/* Futuramente, a lista de envolvidos será exibida aqui */}
            </div>
        </div>
    </div>
  );
}
