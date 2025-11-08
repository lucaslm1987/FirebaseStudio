
'use client';

import { useState } from 'react';
import { useOccurrenceForm } from '../form-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Building2, User, Trash2, Edit } from 'lucide-react';
import { PersonForm } from './person-form';
import type { InvolvedPerson, InvolvedCompany } from '../form-context';
import { InvolvedPersonCard } from './involved-person-card';

export function Step3Involved() {
  const { formData, removeInvolved } = useOccurrenceForm();
  const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<InvolvedPerson | undefined>(undefined);

  const handleAddPerson = () => {
    setSelectedPerson(undefined);
    setIsPersonFormOpen(true);
  };
  
  const handleEditPerson = (person: InvolvedPerson) => {
    setSelectedPerson(person);
    setIsPersonFormOpen(true);
  }

  const handleAddEntity = () => {
    // Placeholder for company logic
    alert("Funcionalidade para Pessoa Jurídica ainda não implementada.");
    // setIsCompanyFormOpen(true);
  };

  return (
    <div className="space-y-6">
        <PersonForm 
            isOpen={isPersonFormOpen} 
            setIsOpen={setIsPersonFormOpen}
            personData={selectedPerson}
        />
        {/* Placeholder for CompanyForm
        <CompanyForm isOpen={isCompanyFormOpen} setIsOpen={setIsCompanyFormOpen} />
        */}

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
            {formData.involved.length > 0 ? (
                <div className="space-y-4">
                    {formData.involved.map(involved => {
                        if (involved.type === 'person') {
                            return (
                                <InvolvedPersonCard 
                                    key={involved.id}
                                    person={involved as InvolvedPerson}
                                    onEdit={() => handleEditPerson(involved as InvolvedPerson)}
                                    onRemove={() => removeInvolved(involved.id)}
                                />
                            )
                        }
                        // Render company card here in the future
                        return null;
                    })}
                </div>
            ) : (
                <div className="rounded-md border min-h-[100px] p-4 bg-muted/30 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Nenhum envolvido adicionado ainda.</p>
                </div>
            )}
        </div>
    </div>
  );
}
