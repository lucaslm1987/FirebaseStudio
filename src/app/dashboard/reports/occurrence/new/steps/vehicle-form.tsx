
'use client';

import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { useOccurrenceForm, type Vehicle } from '../form-context';
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

const vehicleTypes = [
  'automóvel', 'bicicleta', 'bonde', 'caminhão', 'caminhão trator', 'caminhonete',
  'charrete', 'ciclomotor', 'microônibus', 'motocicleta', 'motoneta', 'ônibus',
  'quadriciclo', 'reboque ou semi-reboque', 'triciclo'
].sort();

const carBrands = ["Fiat", "Chevrolet", "Volkswagen", "Ford", "Hyundai", "Toyota", "Honda", "Renault", "Jeep", "Nissan"];
const motorcycleBrands = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "Harley-Davidson", "Triumph", "Ducati"];
const truckBrands = ["Mercedes-Benz", "Volvo", "Scania", "MAN", "DAF", "Iveco"];
const trailerBrands = ["Randon", "Librelato", "Guerra", "Facchini"];
const allBrands = [...new Set([...carBrands, ...motorcycleBrands, ...truckBrands, ...trailerBrands])].sort();

const colors = ["Amarelo", "Azul", "Bege", "Branco", "Cinza", "Dourado", "Laranja", "Marrom", "Prata", "Preto", "Rosa", "Roxo", "Verde", "Vermelho", "Vinho"];


const initialVehicleState: Omit<Vehicle, 'id'> = {
    condition: '',
    type: '',
    plate: '',
    brand: '',
    model: '',
    yearManufacture: '',
    yearModel: '',
    color: '',
    chassis: '',
};

interface VehicleFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  vehicleData?: Vehicle;
}

const maskPlate = (value: string) => {
    value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 4 && value[4].match(/[A-Z]/)) { // Mercosul: ABC1D23
        return value.slice(0, 7).replace(/([A-Z]{3})([0-9])([A-Z])([0-9]{2})/, '$1$2$3$4');
    }
    // Padrão antigo: ABC-1234
    return value.slice(0, 7).replace(/([A-Z]{3})([0-9]{4})/, '$1-$2');
};


export function VehicleForm({ isOpen, setIsOpen, vehicleData }: VehicleFormProps) {
  const { addVehicle, updateVehicle } = useOccurrenceForm();
  const [vehicle, setVehicle] = useState<Omit<Vehicle, 'id'>>(initialVehicleState);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1;
    const yearList = [];
    for (let year = currentYear; year >= 1950; year--) {
      yearList.push(String(year));
    }
    return yearList;
  }, []);
  
  useEffect(() => {
    if (vehicleData) {
      setVehicle(vehicleData);
    } else {
      setVehicle(initialVehicleState);
    }
  }, [vehicleData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let finalValue = value;

    if (id === 'plate') {
        finalValue = maskPlate(value);
    }
    
    setVehicle(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof Omit<Vehicle, 'id'>) => (value: string) => {
    setVehicle(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (vehicleData) {
      updateVehicle(vehicleData.id, vehicle);
    } else {
      addVehicle(vehicle);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl border-primary">
        <DialogHeader>
          <DialogTitle>{vehicleData ? 'Editar' : 'Adicionar'} Veículo</DialogTitle>
          <DialogDescription>
            Preencha os dados do veículo envolvido na ocorrência.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condição *</Label>
                <Select value={vehicle.condition} onValueChange={handleSelectChange('condition')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={vehicle.type} onValueChange={handleSelectChange('type')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                     <Select value={vehicle.brand} onValueChange={handleSelectChange('brand')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            {allBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input id="model" value={vehicle.model || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="plate">Placa</Label>
                    <Input id="plate" placeholder="ABC-1234 ou ABC1D23" value={vehicle.plate || ''} onChange={handleChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                     <Select value={vehicle.color} onValueChange={handleSelectChange('color')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="yearManufacture">Ano Fab.</Label>
                     <Select value={vehicle.yearManufacture} onValueChange={handleSelectChange('yearManufacture')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="yearModel">Ano Mod.</Label>
                     <Select value={vehicle.yearModel} onValueChange={handleSelectChange('yearModel')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="chassis">Chassi</Label>
                    <Input id="chassis" value={vehicle.chassis || ''} onChange={handleChange} />
                </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{vehicleData ? 'Salvar Alterações' : 'Adicionar Veículo'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
