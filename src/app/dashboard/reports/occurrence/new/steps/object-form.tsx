
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useOccurrenceForm, type ObjectItem } from '../form-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const conditions = ['Apreendido', 'Envolvido', 'Localizado', 'Outros', 'Extraviado', 'Subtraído'] as const;
const units = ['unidade', 'metro', 'litro', 'KG', 'grama'] as const;
const colors = ["Amarelo", "Azul", "Bege", "Branco", "Cinza", "Dourado", "Laranja", "Marrom", "Prata", "Preto", "Rosa", "Roxo", "Verde", "Vermelho", "Vinho"];


const initialObjectState: Omit<ObjectItem, 'id'> = {
    condition: '',
    brand: '',
    model: '',
    color: '',
    quantity: 1,
    unit: 'unidade',
    notes: '',
};

interface ObjectFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  objectData?: ObjectItem;
}

export function ObjectForm({ isOpen, setIsOpen, objectData }: ObjectFormProps) {
  const { addObject, updateObject } = useOccurrenceForm();
  const [objectItem, setObjectItem] = useState<Omit<ObjectItem, 'id'>>(initialObjectState);

  useEffect(() => {
    if (objectData) {
      setObjectItem(objectData);
    } else {
      setObjectItem(initialObjectState);
    }
  }, [objectData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    let finalValue: string | number = value;

    if (id === 'quantity') {
        finalValue = value === '' ? 0 : parseFloat(value);
    }
    
    setObjectItem(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof Omit<ObjectItem, 'id'>) => (value: string) => {
    setObjectItem(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (objectData) {
      updateObject(objectData.id, objectItem);
    } else {
      addObject(objectItem);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{objectData ? 'Editar' : 'Adicionar'} Objeto</DialogTitle>
          <DialogDescription>
            Preencha os dados do objeto envolvido na ocorrência.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="condition">Condição *</Label>
                <Select value={objectItem.condition} onValueChange={handleSelectChange('condition')} required>
                    <SelectTrigger className="w-full md:w-1/3"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input id="brand" value={objectItem.brand || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input id="model" value={objectItem.model || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                     <Select value={objectItem.color} onValueChange={handleSelectChange('color')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input id="quantity" type="number" min="0" value={objectItem.quantity || 1} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                     <Select value={objectItem.unit} onValueChange={handleSelectChange('unit')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea 
                    id="notes" 
                    placeholder="Descrição detalhada do objeto, número de série, etc..."
                    value={objectItem.notes || ''}
                    onChange={handleChange}
                    rows={4}
                />
            </div>

          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{objectData ? 'Salvar Alterações' : 'Adicionar Objeto'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
