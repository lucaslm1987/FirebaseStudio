
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useOccurrenceForm, type NarcoticItem } from '../form-context';
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

const conditions = ['Apreendido', 'Envolvido', 'Localizado', 'Outros'] as const;
const substanceTypes = ['Maconha', 'Cocaína', 'Crack', 'Ecstasy', 'LSD', 'Heroína', 'Outro'].sort();
const units = ['grama', 'KG', 'litro', 'ml', 'unidade'] as const;
const packagings = ['Pedra', 'Porção', 'Tijolo', 'Eppendorf'] as const;


const initialNarcoticState: Omit<NarcoticItem, 'id'> = {
    condition: '',
    type: '',
    quantity: 0,
    unit: 'grama',
    packaging: 'Porção',
};

interface NarcoticFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  narcoticData?: NarcoticItem;
}

export function NarcoticForm({ isOpen, setIsOpen, narcoticData }: NarcoticFormProps) {
  const { addNarcotic, updateNarcotic } = useOccurrenceForm();
  const [narcoticItem, setNarcoticItem] = useState<Omit<NarcoticItem, 'id'>>(initialNarcoticState);

  useEffect(() => {
    if (narcoticData) {
      setNarcoticItem(narcoticData);
    } else {
      setNarcoticItem(initialNarcoticState);
    }
  }, [narcoticData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let finalValue: string | number = value;

    if (id === 'quantity') {
        finalValue = value === '' ? 0 : parseFloat(value);
        if (finalValue < 0) finalValue = 0;
    }
    
    setNarcoticItem(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof Omit<NarcoticItem, 'id'>) => (value: string) => {
    setNarcoticItem(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (narcoticData) {
      updateNarcotic(narcoticData.id, narcoticItem);
    } else {
      addNarcotic(narcoticItem);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl border-primary">
        <DialogHeader>
          <DialogTitle>{narcoticData ? 'Editar' : 'Adicionar'} Entorpecente</DialogTitle>
          <DialogDescription>
            Preencha os dados do entorpecente apreendido/envolvido.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="condition">Condição *</Label>
                    <Select value={narcoticItem.condition} onValueChange={handleSelectChange('condition')} required>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                        {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={narcoticItem.type} onValueChange={handleSelectChange('type')} required>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {substanceTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input id="quantity" type="number" min="0" value={narcoticItem.quantity || 0} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                     <Select value={narcoticItem.unit} onValueChange={handleSelectChange('unit')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="packaging">Acondicionamento</Label>
                     <Select value={narcoticItem.packaging} onValueChange={handleSelectChange('packaging')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {packagings.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {narcoticItem.type === 'Outro' && (
                 <div className="space-y-2">
                    <Label htmlFor="type-other">Especifique o tipo</Label>
                    <Input id="type" value={narcoticItem.type} onChange={handleChange} placeholder="Digite o nome da substância" />
                 </div>
            )}

          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{narcoticData ? 'Salvar Alterações' : 'Adicionar Item'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    