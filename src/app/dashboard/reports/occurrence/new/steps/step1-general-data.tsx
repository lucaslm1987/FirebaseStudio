'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const viaturas = [
  'VTR-01', 'VTR-02', 'VTR-03', 'VTR-04', 'VTR-05',
  'VTR-06', 'VTR-07', 'VTR-08', 'VTR-09', 'VTR-10'
];


export function Step1GeneralData() {

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you would set state here
          alert(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Não foi possível obter a localização.");
        }
      );
    } else {
      alert("Geolocalização não é suportada por este navegador.");
    }
  };


  return (
    <div className="space-y-8">
       {/* Data e Hora */}
       <div className="space-y-4">
        <h3 className="text-lg font-medium">Data e Hora</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
                <Label htmlFor="data-fato">Data do Fato</Label>
                <Input id="data-fato" type="date" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hora-fato">Hora do Fato</Label>
                <Input id="hora-fato" type="time" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="data-comunicacao">Data da Comunicação</Label>
                <Input id="data-comunicacao" type="date" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hora-comunicacao">Hora da Comunicação</Label>
                <Input id="hora-comunicacao" type="time" required />
            </div>
        </div>
      </div>

       {/* Origem e Autoria */}
       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
                <Label>Origem da Solicitação</Label>
                <RadioGroup defaultValue="deparou" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deparou" id="r-deparou" />
                        <Label htmlFor="r-deparou">A equipe deparou-se</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diretamente" id="r-diretamente" />
                        <Label htmlFor="r-diretamente">Diretamente à equipe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="radio" id="r-radio" />
                        <Label htmlFor="r-radio">Via rádio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outros" id="r-outros" />
                        <Label htmlFor="r-outros">Outros</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="space-y-3">
                <Label>Autoria</Label>
                <RadioGroup defaultValue="desconhecida" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conhecida" id="r-conhecida" />
                        <Label htmlFor="r-conhecida">Conhecida</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="desconhecida" id="r-desconhecida" />
                        <Label htmlFor="r-desconhecida">Desconhecida</Label>
                    </div>
                </RadioGroup>
            </div>
       </div>

        {/* Flags */}
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
                <Switch id="flagrante" />
                <Label htmlFor="flagrante">Flagrante?</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="ato-infracional" />
                <Label htmlFor="ato-infracional">Ato Infracional?</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="violencia-domestica" />
                <Label htmlFor="violencia-domestica">Violência Doméstica?</Label>
            </div>
        </div>

      {/* Local */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Local da Ocorrência</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2 sm:col-span-2 md:col-span-3">
                <Label htmlFor="rua">Rua</Label>
                <Input id="rua" placeholder="Nome da rua, avenida..." required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="numero">Nº</Label>
                <Input id="numero" placeholder="Ex: 123" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" placeholder="Nome do bairro" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" placeholder="Apto, bloco, casa..." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                 <Select>
                    <SelectTrigger id="estado">
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 sm:col-span-2 md:col-span-3">
                 <Button variant="outline" onClick={handleGetLocation} className="w-full md:w-auto">
                    <MapPin className="mr-2 h-4 w-4" />
                    Obter Latitude e Longitude
                </Button>
            </div>
        </div>
      </div>
      
       {/* Viatura */}
       <div className="space-y-4">
        <h3 className="text-lg font-medium">Viatura</h3>
         <div className="w-full max-w-xs">
            <Label htmlFor="viatura">Viatura</Label>
            <Select>
                <SelectTrigger id="viatura">
                    <SelectValue placeholder="Selecione a viatura..." />
                </SelectTrigger>
                <SelectContent>
                    {viaturas.map((vtr) => (
                        <SelectItem key={vtr} value={vtr}>{vtr}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
      </div>

    </div>
  );
}
