
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useOccurrenceForm, type WeaponItem } from '../form-context';
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

const conditions = ['Apreendido', 'Envolvido', 'Localizado', 'Outros', 'Extraviado', 'Subtraído'] as const;
const weaponTypes = ['Carabina', 'Espingarda', 'Fuzil', 'Garrucha', 'Metralhadora', 'Pistola', 'Revólver', 'Rifle', 'Submetralhadora'].sort();
const weaponBrands = [
    'Armalite',
    'Benelli',
    'Beretta',
    'Bersa',
    'CBC',
    'Colt',
    'CZ',
    'Daniel Defense',
    'Glock',
    'Heckler & Koch',
    'Imbel',
    'Kimber Manufacturing',
    'Mossberg',
    'Remington Arms',
    'Rossi',
    'Ruger',
    'SIG Sauer',
    'Smith & Wesson',
    'Springfield Armory',
    'Steyr',
    'Tanfoglio',
    'Taurus',
    'Winchester',
    'Outra'
].sort();

const calibres = [
    '.17 HMR', '.22 LR', '.22 WMR', '.223 Remington', '.243 Winchester', '.270 Winchester', '.30-06 Springfield', '.300 AAC Blackout', '.308 Winchester',
    '.357 Magnum', '.38 Special', '.38 Super', '.380 ACP', '.40 S&W', '.44 Magnum', '.45 ACP', '.50 BMG', '5.56x45mm NATO', '6.5mm Creedmoor', '7.62x39mm',
    '7.62x51mm NATO', '9mm Luger', '10mm Auto', 'Calibre 12', 'Calibre 16', 'Calibre 20', 'Calibre 28', 'Calibre 32', 'Calibre 36 (.410)', 'Outro'
].sort();


const initialWeaponState: Omit<WeaponItem, 'id'> = {
    condition: '',
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    calibre: '',
    ammoIntact: 0,
    ammoSpent: 0,
};

interface WeaponFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  weaponData?: WeaponItem;
}

export function WeaponForm({ isOpen, setIsOpen, weaponData }: WeaponFormProps) {
  const { addWeapon, updateWeapon } = useOccurrenceForm();
  const [weaponItem, setWeaponItem] = useState<Omit<WeaponItem, 'id'>>(initialWeaponState);

  useEffect(() => {
    if (weaponData) {
      setWeaponItem(weaponData);
    } else {
      setWeaponItem(initialWeaponState);
    }
  }, [weaponData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let finalValue: string | number = value;

    if (id === 'ammoIntact' || id === 'ammoSpent') {
        finalValue = value === '' ? 0 : parseInt(value, 10);
        if (finalValue < 0) finalValue = 0;
    }
    
    setWeaponItem(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof Omit<WeaponItem, 'id'>) => (value: string) => {
    setWeaponItem(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (weaponData) {
      updateWeapon(weaponData.id, weaponItem);
    } else {
      addWeapon(weaponItem);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl border-primary">
        <DialogHeader>
          <DialogTitle>{weaponData ? 'Editar' : 'Adicionar'} Arma</DialogTitle>
          <DialogDescription>
            Preencha os dados da arma de fogo apreendida/envolvida.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="condition">Condição *</Label>
                    <Select value={weaponItem.condition} onValueChange={handleSelectChange('condition')} required>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                        {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={weaponItem.type} onValueChange={handleSelectChange('type')} required>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {weaponTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select value={weaponItem.brand} onValueChange={handleSelectChange('brand')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {weaponBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input id="model" value={weaponItem.model || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="serialNumber">Nº de Série</Label>
                    <Input id="serialNumber" value={weaponItem.serialNumber || ''} onChange={handleChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="calibre">Calibre</Label>
                    <Select value={weaponItem.calibre} onValueChange={handleSelectChange('calibre')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {calibres.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="ammoIntact">Munições Intactas</Label>
                    <Input id="ammoIntact" type="number" min="0" value={weaponItem.ammoIntact || 0} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ammoSpent">Munições Deflagradas</Label>
                    <Input id="ammoSpent" type="number" min="0" value={weaponItem.ammoSpent || 0} onChange={handleChange} />
                </div>
            </div>

          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{weaponData ? 'Salvar Alterações' : 'Adicionar Arma'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
