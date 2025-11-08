
'use client';

import { useState } from 'react';
import { useOccurrenceForm } from '../form-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const crimesPorLei = {
    "Código Penal": [
        { article: "Art. 121", name: "Homicídio" },
        { article: "Art. 121, § 2º, VI", name: "Feminicídio" },
        { article: "Art. 122", name: "Instigação ou auxílio a suicídio" },
        { article: "Art. 124", name: "Aborto" },
        { article: "Art. 129", name: "Lesão Corporal" },
        { article: "Art. 138", name: "Calúnia" },
        { article: "Art. 139", name: "Difamação" },
        { article: "Art. 140", name: "Injúria" },
        { article: "Art. 147", name: "Ameaça" },
        { article: "Art. 147-A", name: "Perseguição (Stalking)" },
        { article: "Art. 155", name: "Furto" },
        { article: "Art. 157", name: "Roubo" },
        { article: "Art. 158", name: "Extorsão" },
        { article: "Art. 163", name: "Dano" },
        { article: "Art. 168", name: "Apropriação Indébita" },
        { article: "Art. 171", name: "Estelionato" },
        { article: "Art. 180", name: "Receptação" },
        { article: "Art. 213", name: "Estupro" },
        { article: "Art. 215-A", name: "Importunação Sexual" },
        { article: "Art. 216-A", name: "Assédio Sexual" },
        { article: "Art. 289", name: "Moeda Falsa" },
        { article: "Art. 299", name: "Falsidade Ideológica" },
        { article: "Art. 304", name: "Uso de Documento Falso" },
        { article: "Art. 311", name: "Adulteração de sinal identificador de veículo" },
    ],
    "CTB": [
        { article: "Art. 302", name: "Homicídio culposo na direção de veículo" },
        { article: "Art. 303", name: "Lesão corporal culposa na direção de veículo" },
        { article: "Art. 304", name: "Omissão de socorro" },
        { article: "Art. 305", name: "Fuga do local do acidente" },
        { article: "Art. 306", name: "Dirigir sob efeito de álcool" },
        { article: "Art. 309", name: "Dirigir sem habilitação gerando perigo" },
    ],
    "Código do Consumidor": [
        { article: "Art. 66", name: "Afirmação falsa ou enganosa" },
        { article: "Art. 67", name: "Publicidade enganosa" }
    ],
    "Lei de Drogas": [
        { article: "Art. 28", name: "Posse para consumo/Porte de entorpecente" },
        { article: "Art. 33", name: "Tráfico de drogas" },
        { article: "Art. 35", name: "Associação para o tráfico" },
        { article: "Tema 506 STF", name: "Ilícito extra penal" },
    ],
    "Lei de Armas": [
        { "article": "Art. 12", "name": "Posse irregular de arma de fogo de uso permitido" },
        { "article": "Art. 13", "name": "Omissão de cautela" },
        { article: "Art. 14", name: "Porte ilegal de arma de fogo de uso permitido" },
        { article: "Art. 15", name: "Disparo de arma de fogo" },
        { "article": "Art. 16", "name": "Posse ou porte ilegal de arma de fogo de uso restrito" },
        { "article": "Art. 17", "name": "Comércio ilegal de arma de fogo" }
    ],
    "Lei de Contravenções Penais": [
        { article: "Art. 21", name: "Vias de fato" },
        { article: "Art. 42", name: "Perturbação do sossego" }
    ],
    "Lei Ambiental": [
        { article: "Art. 32", name: "Maus-tratos a animais" },
        { article: "Art. 50", name: "Desmatamento ilegal" }
    ],
};

type CrimeKey = keyof typeof crimesPorLei;
type Crime = { article: string; name: string };

export function Step2Nature() {
  const { formData, updateField } = useOccurrenceForm();
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedNatures = formData.nature ? formData.nature.split(',').filter(n => n).map(s => s.trim()) : [];

  const handleNatureChange = (crime: Crime, isSelected: boolean) => {
    const natureString = `${crime.name} (${crime.article})`;
    let newNatures = [...selectedNatures];
    if (isSelected) {
      if (!newNatures.includes(natureString)) {
        newNatures.push(natureString);
      }
    } else {
      newNatures = newNatures.filter(n => n !== natureString);
    }
    updateField({ nature: newNatures.join(', ') });
  };
  
  const handleRemoveNature = (natureToRemove: string) => {
    const newNatures = selectedNatures.filter(n => n !== natureToRemove);
    updateField({ nature: newNatures.join(', ') });
  }

  const filteredCrimes = Object.keys(crimesPorLei).reduce((acc, lei) => {
      const key = lei as CrimeKey;
      const filtered = crimesPorLei[key].filter(crime => 
          crime.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crime.article.toLowerCase().includes(searchTerm.toLowerCase())
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
                placeholder="Digite para filtrar por crime ou artigo..."
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
                            {(filteredCrimes[lei as CrimeKey]).map(crime => {
                                const natureString = `${crime.name} (${crime.article})`;
                                const crimeId = `${lei}-${crime.name}-${crime.article}`.replace(/\s/g, '-');
                                return (
                                <div key={crimeId} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={crimeId}
                                        checked={selectedNatures.includes(natureString)}
                                        onCheckedChange={(checked) => handleNatureChange(crime, !!checked)}
                                    />
                                    <Label htmlFor={crimeId} className="font-normal cursor-pointer">
                                        {crime.name} <span className="text-muted-foreground text-xs">({crime.article})</span>
                                    </Label>
                                </div>
                            )}
                            )}
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
                        <Badge key={nature} variant="secondary" className="text-sm font-medium">
                           {nature}
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="ml-1 h-4 w-4 rounded-full"
                             onClick={() => handleRemoveNature(nature)}
                           >
                               <X className="h-3 w-3" />
                               <span className="sr-only">Remover {nature}</span>
                           </Button>
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground p-1">Nenhuma natureza selecionada.</p>
                )}
            </div>
        </div>
    </div>
  );
}
