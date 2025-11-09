
'use client';

import { useState } from 'react';
import { useOccurrenceForm } from '../form-context';
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
import { Camera, MapPin, PlusCircle, Trash2, User, Calendar, Globe, Users, Car } from 'lucide-react';
import type { TeamMember } from '../form-context';
import { allTeamMembers, roles, viaturas } from '../form-context';

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function Step1GeneralData() {
  const { formData, updateField, updateTeamMember, addTeamMember, removeTeamMember } = useOccurrenceForm();
  const [selectedMember, setSelectedMember] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField({ [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (id: string) => (value: string) => {
    updateField({ [id]: value });
  };

  const handleSwitchChange = (id: string) => (checked: boolean) => {
    updateField({ [id]: checked });
  };

  const handleRadioChange = (id: string) => (value: string) => {
    updateField({ [id]: value });
  };


  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField({ 
              latitude: String(position.coords.latitude),
              longitude: String(position.coords.longitude)
          });
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

  const handleAddMember = () => {
    if (selectedMember && !formData?.team?.find(m => m.name === selectedMember)) {
      addTeamMember(selectedMember);
      setSelectedMember('');
    }
  };

  if (!formData || !formData.team) return null;

  return (
    <div className="space-y-8">
       {/* Data e Hora */}
       <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Data e Hora
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
                <Label htmlFor="factDate">Data do Fato</Label>
                <Input id="factDate" type="date" value={formData.factDate || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="factTime">Hora do Fato</Label>
                <Input id="factTime" type="time" value={formData.factTime || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="communicationDate">Data da Comunicação</Label>
                <Input id="communicationDate" type="date" value={formData.communicationDate || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="communicationTime">Hora da Comunicação</Label>
                <Input id="communicationTime" type="time" value={formData.communicationTime || ''} onChange={handleChange} required />
            </div>
        </div>
      </div>

       {/* Origem e Autoria */}
       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
                <Label>Origem da Solicitação</Label>
                <RadioGroup value={formData.requestOrigin} onValueChange={handleRadioChange('requestOrigin')} className="flex flex-wrap gap-4">
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
                <RadioGroup value={formData.authorship} onValueChange={handleRadioChange('authorship')} className="flex flex-wrap gap-4">
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
                <Switch id="isFlagrant" checked={formData.isFlagrant} onCheckedChange={handleSwitchChange('isFlagrant')} />
                <Label htmlFor="isFlagrant">Flagrante?</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="isInfraction" checked={formData.isInfraction} onCheckedChange={handleSwitchChange('isInfraction')} />
                <Label htmlFor="isInfraction">Ato Infracional?</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="isDomesticViolence" checked={formData.isDomesticViolence} onCheckedChange={handleSwitchChange('isDomesticViolence')} />
                <Label htmlFor="isDomesticViolence">Violência Doméstica?</Label>
            </div>
        </div>

      {/* Local */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Local da Ocorrência
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2 sm:col-span-2 md:col-span-3">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" placeholder="Nome da rua, avenida..." value={formData.street || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="number">Nº</Label>
                <Input id="number" placeholder="Ex: 123" value={formData.number || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" placeholder="Nome do bairro" value={formData.neighborhood || ''} onChange={handleChange} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" placeholder="Apto, bloco, casa..." value={formData.complement || ''} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" value={formData.city || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                 <Select value={formData.state} onValueChange={handleSelectChange('state')}>
                    <SelectTrigger id="state">
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" placeholder="Ex: -23.55052" value={formData.latitude || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" placeholder="Ex: -46.633308" value={formData.longitude || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2 self-end">
                <Button variant="outline" onClick={handleGetLocation} className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Obter Coordenadas
                </Button>
            </div>
        </div>
      </div>
      
       {/* Equipe */}
       <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Equipe
        </h3>
        <div className="space-y-2">
            <Label htmlFor="team-member">Membro da Equipe</Label>
            <div className="flex items-start gap-2">
                 <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger id="team-member">
                        <SelectValue placeholder="Selecione um membro..." />
                    </SelectTrigger>
                    <SelectContent>
                        {allTeamMembers.map((member) => (
                            <SelectItem key={member} value={member} disabled={formData.team.some(m => m.name === member)}>{member}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleAddMember} size="icon" variant="outline">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Adicionar</span>
                </Button>
            </div>
        </div>

        {formData.team.length > 0 && (
            <div className="rounded-md border p-4 space-y-3">
                <h4 className="text-sm font-medium">Membros Selecionados:</h4>
                <ul className="space-y-4">
                    {formData.team.map((member, index) => (
                        <li key={member.name} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-md bg-muted/50">
                            <div className="flex items-center gap-2 font-medium">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {member.bodyCam && <Camera className="h-4 w-4 text-primary" title="Body Cam Ativa" />}
                                <span className='flex-1'>{member.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`bodycam-${index}`} className='text-xs'>Body Cam?</Label>
                                    <Switch 
                                        id={`bodycam-${index}`} 
                                        checked={member.bodyCam} 
                                        onCheckedChange={(checked) => updateTeamMember(member.name, 'bodyCam', checked)}
                                    />
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Label htmlFor={`role-${index}`} className='text-xs'>Cargo</Label>
                                    <Select 
                                        value={member.role}
                                        onValueChange={(value) => updateTeamMember(member.name, 'role', value)}
                                    >
                                        <SelectTrigger id={`role-${index}`} className="h-8 w-[120px] text-xs">
                                            <SelectValue placeholder="Cargo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={() => removeTeamMember(member.name)} size="icon" variant="ghost" className="h-7 w-7">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Remover</span>
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>

       {/* Viatura */}
       <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Viatura
        </h3>
         <div className="w-full max-w-xs">
            <Label htmlFor="vehicle">Viatura</Label>
            <Select value={formData.vehicle} onValueChange={handleSelectChange('vehicle')}>
                <SelectTrigger id="vehicle">
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

    

    
