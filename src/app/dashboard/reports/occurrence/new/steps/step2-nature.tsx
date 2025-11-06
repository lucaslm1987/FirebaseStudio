
'use client';

import { useState } from 'react';
import { useOccurrenceForm } from '../form-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const crimesPorLei = {
    "Código Penal": ["Furto", "Roubo", "Estelionato", "Apropriação Indébita", "Dano", "Lesão Corporal", "Homicídio"],
    "CTB": ["Dirigir sob efeito de álcool", "Excesso de velocidade", "Avançar sinal vermelho", "Manobra perigosa"],
    "Código do Consumidor": ["Produto com defeito", "Publicidade enganosa"],
    "Lei de Drogas": ["Tráfico de drogas", "Posse para consumo"],
    "Lei de Armas": ["Porte ilegal de arma de fogo", "Disparo de arma de fogo"],
    "Lei de Contravenções Penais": ["Perturbação do sossego", "Vias de fato"],
    "Lei Ambiental": ["Desmatamento ilegal", "Maus-tratos a animais"],
};

type CrimeKey = keyof typeof crimesPorLei;

export function Step2Nature() {
  const { formData, updateField } = useOccurrenceForm();
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedNatures = formData.nature ? formData.nature.split(',').filter(n => n).map(s => s.trim()) : [];

  const handleNatureChange = (nature: string, isSelected: boolean) => {
    let newNatures = [...selectedNatures];
    if (isSelected) {
      if (!newNatures.includes(nature)) {
        newNatures.push(nature);
      }
    } else {
      newNatures = newNatures.filter(n => n !== nature);
    }
    updateField({ nature: newNatures.join(', ') });
  };
  
  const filteredCrimes = Object.keys(crimesPorLei).reduce((acc, lei) => {
      const key = lei as CrimeKey;
      const filtered = crimesPorLei[key].filter(crime => 
          crime.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
          acc[key] = filtered;
      }
      return acc;
  }, {} as typeof crimesPorLei);

  return (
    <div className="space-y-6">
        <div>
            <Label htmlFor="search-nature">Pesquisar Natureza</Label>
            <Input
                id="search-nature"
                placeholder="Digite para filtrar os crimes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <Accordion type="multiple" className="w-full">
            {Object.keys(filteredCrimes).map(lei => (
                <AccordionItem key={lei} value={lei}>
                    <AccordionTrigger>{lei}</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                            {(filteredCrimes[lei as CrimeKey]).map(crime => (
                                <div key={crime} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`crime-${crime}`}
                                        checked={selectedNatures.includes(crime)}
                                        onCheckedChange={(checked) => handleNatureChange(crime, !!checked)}
                                    />
                                    <Label htmlFor={`crime-${crime}`} className="font-normal cursor-pointer">
                                        {crime}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        
        <div>
            <Label>Naturezas Selecionadas</Label>
            <div className="mt-2 flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md border border-input">
                {selectedNatures.length > 0 ? (
                    selectedNatures.map(nature => (
                        <Badge key={nature} variant="secondary" className="text-sm">
                            {nature}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma natureza selecionada.</p>
                )}
            </div>
        </div>
    </div>
  );
}
