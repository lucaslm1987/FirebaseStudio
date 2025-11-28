'use client';

import { useState } from 'react';
import type { FormData, InvolvedPerson, InvolvedCompany } from '@/types/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Building2 } from 'lucide-react';
import { PersonForm } from './person-form';
import { CompanyForm } from './company-form';
import { InvolvedPersonCard } from './involved-person-card';
import { InvolvedCompanyCard } from './involved-company-card';


interface Step3InvolvedProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function Step3Involved({ formData, setFormData }: Step3InvolvedProps) {
  const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<InvolvedPerson | undefined>(undefined);
  const [selectedCompany, setSelectedCompany] = useState<InvolvedCompany | undefined>(undefined);

  const addInvolved = (involved: InvolvedPerson | InvolvedCompany) => {
    setFormData(prev => ({
      ...prev,
      involved: [...(prev.involved ?? []), involved]
    }));
  };

  const updateInvolved = (involvedId: string, updatedData: Partial<InvolvedPerson> | Partial<InvolvedCompany>) => {
    setFormData(prev => ({
      ...prev,
      involved: (prev.involved ?? []).map(i => i.id === involvedId ? { ...i, ...updatedData } : i) as Array<InvolvedPerson | InvolvedCompany>,
    }));
  };

  const removeInvolved = (involvedId: string) => {
    setFormData(prev => ({
      ...prev,
      involved: (prev.involved ?? []).filter(i => i.id !== involvedId)
    }));
  };


  const handleAddPerson = () => {
    setSelectedPerson(undefined);
    setIsPersonFormOpen(true);
  };
  
  const handleEditPerson = (person: InvolvedPerson) => {
    setSelectedPerson(person);
    setIsPersonFormOpen(true);
  };

  const handleAddCompany = () => {
    setSelectedCompany(undefined);
    setIsCompanyFormOpen(true);
  };

  const handleEditCompany = (company: InvolvedCompany) => {
    setSelectedCompany(company);
    setIsCompanyFormOpen(true);
  };

  const involvedList = formData?.involved ?? [];

  return (
    <div className="space-y-6">
      <PersonForm 
        isOpen={isPersonFormOpen} 
        setIsOpen={setIsPersonFormOpen}
        personData={selectedPerson}
        addInvolved={addInvolved}
        updateInvolved={updateInvolved}
        formData={formData}
      />

      <CompanyForm 
        isOpen={isCompanyFormOpen}
        setIsOpen={setIsCompanyFormOpen}
        companyData={selectedCompany}
        addInvolved={addInvolved}
        updateInvolved={updateInvolved}
        formData={formData}
      />

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
            <Button className="w-full" onClick={handleAddCompany}>
              Adicionar Pessoa Jurídica
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h4 className="font-medium mb-4">Envolvidos Adicionados:</h4>
        {involvedList.length > 0 ? (
            <div className="space-y-4">
                {involvedList.map(involved => {
                    if (involved.type === 'person') {
                        return (
                            <InvolvedPersonCard 
                                key={involved.id}
                                person={involved as InvolvedPerson}
                                onEdit={() => handleEditPerson(involved as InvolvedPerson)}
                                onRemove={() => removeInvolved(involved.id)}
                            />
                        )
                    } else if (involved.type === 'company') {
                        return (
                            <InvolvedCompanyCard
                                key={involved.id}
                                company={involved as InvolvedCompany}
                                onEdit={() => handleEditCompany(involved as InvolvedCompany)}
                                onRemove={() => removeInvolved(involved.id)}
                            />
                        )
                    }
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
