
'use client';

import { useOccurrenceForm } from '../form-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Car, Box, Pill, Target } from 'lucide-react';


const ItemSection = ({ title, icon, field, placeholder }: { title: string, icon: React.ReactNode, field: 'vehicles' | 'objects' | 'narcotics' | 'weapons', placeholder: string }) => {
    const { formData, updateItemsField } = useOccurrenceForm();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateItemsField(field, e.target.value);
    };

    return (
        <AccordionItem value={title}>
            <AccordionTrigger>
                <div className="flex items-center gap-2">
                    {icon}
                    {title}
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2 p-1">
                    <Label htmlFor={field} className="sr-only">{title}</Label>
                    <Textarea
                        id={field}
                        placeholder={placeholder}
                        rows={5}
                        value={formData.items?.[field] || ''}
                        onChange={handleChange}
                    />
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}


export function Step4Items() {
  return (
    <div className="space-y-4">
        <h3 className="text-lg font-medium">Veículos, Objetos, Entorpecentes e Armas</h3>
        <p className="text-sm text-muted-foreground">
            Descreva detalhadamente quaisquer itens relevantes para a ocorrência.
        </p>

        <Accordion type="multiple" className="w-full">
            <ItemSection 
                title="Veículos"
                icon={<Car className="h-5 w-5 text-primary" />}
                field="vehicles"
                placeholder="Ex: Fiat Uno, branco, Placa ABC-1234, com avaria no para-choque dianteiro..."
            />
             <ItemSection 
                title="Objetos"
                icon={<Box className="h-5 w-5 text-primary" />}
                field="objects"
                placeholder="Ex: Celular Samsung A51, nº de série XXXXX, com a tela trincada..."
            />
             <ItemSection 
                title="Entorpecentes"
                icon={<Pill className="h-5 w-5 text-primary" />}
                field="narcotics"
                placeholder="Ex: 10 porções de substância análoga à maconha, pesando aproximadamente 50g..."
            />
             <ItemSection 
                title="Armas"
                icon={<Target className="h-5 w-5 text-primary" />}
                field="weapons"
                placeholder="Ex: Revólver Calibre .38, marca Taurus, nº de série YYYYY, com 5 munições intactas..."
            />
        </Accordion>
    </div>
  );
}
