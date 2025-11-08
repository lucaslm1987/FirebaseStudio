
'use client';

import { useState } from 'react';
import { useOccurrenceForm, type ItemEntry, type Vehicle, type ObjectItem } from '../form-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Car, Box, Pill, Target, PlusCircle } from 'lucide-react';
import { VehicleForm } from './vehicle-form';
import { VehicleCard } from './vehicle-card';
import { ObjectForm } from './object-form';
import { ObjectCard } from './object-card';


const itemConditions = ['Apreendido', 'Envolvido', 'Localizado', 'Outros'] as const;

const ItemEntrySection = ({ 
    field, 
    placeholder 
}: { 
    field: 'narcotics' | 'weapons', 
    placeholder: string 
}) => {
    const { formData, updateItemEntry } = useOccurrenceForm();

    const itemData = formData.items?.[field] ?? { condition: '', description: '' };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateItemEntry(field, { description: e.target.value });
    };

    const handleConditionChange = (value: ItemEntry['condition']) => {
        updateItemEntry(field, { condition: value });
    };

    return (
        <div className="space-y-4 p-1">
            <div className="space-y-2">
                <Label htmlFor={`${field}-condition`}>Condição</Label>
                <Select value={itemData.condition} onValueChange={handleConditionChange}>
                    <SelectTrigger id={`${field}-condition`} className="w-full md:w-1/3">
                        <SelectValue placeholder="Selecione a condição..." />
                    </SelectTrigger>
                    <SelectContent>
                        {itemConditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor={field} className="sr-only">{field}</Label>
                <Textarea
                    id={field}
                    placeholder={placeholder}
                    rows={5}
                    value={itemData.description}
                    onChange={handleDescriptionChange}
                />
            </div>
        </div>
    )
}

const VehicleSection = () => {
    const { formData, removeVehicle } = useOccurrenceForm();
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);

    const handleAdd = () => {
        setSelectedVehicle(undefined);
        setFormOpen(true);
    }

    const handleEdit = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setFormOpen(true);
    }

    return (
        <>
            <VehicleForm 
                isOpen={isFormOpen}
                setIsOpen={setFormOpen}
                vehicleData={selectedVehicle}
            />
            <div className="space-y-4 p-1">
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Veículo
                </Button>

                <div className="mt-4 space-y-4">
                    {formData.items.vehicles.map(vehicle => (
                        <VehicleCard 
                            key={vehicle.id}
                            vehicle={vehicle}
                            onEdit={() => handleEdit(vehicle)}
                            onRemove={() => removeVehicle(vehicle.id)}
                        />
                    ))}
                </div>
                 {formData.items.vehicles.length === 0 && (
                    <div className="rounded-md border min-h-[80px] p-4 bg-muted/30 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Nenhum veículo adicionado.</p>
                    </div>
                )}
            </div>
        </>
    )
}

const ObjectSection = () => {
    const { formData, removeObject } = useOccurrenceForm();
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState<ObjectItem | undefined>(undefined);

    const handleAdd = () => {
        setSelectedObject(undefined);
        setFormOpen(true);
    }

    const handleEdit = (object: ObjectItem) => {
        setSelectedObject(object);
        setFormOpen(true);
    }

    return (
        <>
            <ObjectForm 
                isOpen={isFormOpen}
                setIsOpen={setFormOpen}
                objectData={selectedObject}
            />
            <div className="space-y-4 p-1">
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Objeto
                </Button>

                <div className="mt-4 space-y-4">
                    {formData.items.objects.map(object => (
                        <ObjectCard 
                            key={object.id}
                            object={object}
                            onEdit={() => handleEdit(object)}
                            onRemove={() => removeObject(object.id)}
                        />
                    ))}
                </div>
                 {formData.items.objects.length === 0 && (
                    <div className="rounded-md border min-h-[80px] p-4 bg-muted/30 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Nenhum objeto adicionado.</p>
                    </div>
                )}
            </div>
        </>
    )
}


export function Step4Items() {
  return (
    <div className="space-y-4">
        <h3 className="text-lg font-medium">Veículos, Objetos, Entorpecentes e Armas</h3>
        <p className="text-sm text-muted-foreground">
            Descreva detalhadamente quaisquer itens relevantes para a ocorrência e sua condição.
        </p>

        <Accordion type="multiple" className="w-full" defaultValue={['Veículos']}>
            <AccordionItem value="Veículos">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Veículos
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <VehicleSection />
                </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="Objetos">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-primary" />
                        Objetos
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ObjectSection />
                </AccordionContent>
            </AccordionItem>

             <AccordionItem value="Entorpecentes">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        Entorpecentes
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ItemEntrySection
                        field="narcotics"
                        placeholder="Ex: 10 porções de substância análoga à maconha, pesando aproximadamente 50g..."
                    />
                </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="Armas">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Armas
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ItemEntrySection
                        field="weapons"
                        placeholder="Ex: Revólver Calibre .38, marca Taurus, nº de série YYYYY, com 5 munições intactas..."
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}
