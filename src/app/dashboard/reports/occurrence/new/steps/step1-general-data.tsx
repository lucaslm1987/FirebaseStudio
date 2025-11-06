'use client';

import { useState } from 'react';
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
import { Camera, MapPin, PlusCircle, Trash2, User } from 'lucide-react';

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const viaturas = [
  'VTR-01', 'VTR-02', 'VTR-03', 'VTR-04', 'VTR-05',
  'VTR-06', 'VTR-07', 'VTR-08', 'VTR-09', 'VTR-10'
];

const allTeamMembers = [
    "ADAILTON SANTOS DE OLIVEIRA - GCM 1ª CL",
    "ADÃO APARECIDO DE MORAES - GCM CL ESP",
    "ADAUTO RODRIGUES DA SILVA - GCM CL ESP",
    "ADRIANA VALERIA DE MATTOS - GCM CL ESP",
    "ANDERSON MARCHESI ROCHA - GCM 2ª CL",
    "ANDREIA DE OLIVEIRA - GCM CL ESP",
    "ANTONIO ADALBERTO DE SOUSA - GCM 1ª CL",
    "ANTONIO RIBEIRO DA SILVA NETO - GCM CL ESP",
    "CÁSSIA DE MORAES - GCM CL ESP",
    "CELIA MARIA DE JESUS - GCM CL ESP",
    "CREUSA APARECIDA VITO - GCM CL ESP",
    "DALMO EDMILSON TOMAZELA - GCM CL ESP",
    "DANIEL DE FREITAS - GCM CL ESP",
    "DIEGO GENEZELLI - GCM 1ª CL",
    "EDSON DA CONSTA MANÇO - GCM 1ª CL",
    "ELIAS COSME DOS SANTOS - GCM 1ª CL",
    "FABIANO JOÃO SANTIAGO - GCM CL ESP",
    "FABIO GUILHERME ANICETO - GCM CL ESP",
    "FRANCIMEIRE LEAL MOREIRA - GCM CL ESP",
    "FRANCISCO VILSON PINTO - GCM 1ª CL",
    "IRINEU RIBEIRO - GCM CMT CL ESP",
    "JOSÉ ARMANDO PASCHUAL JUNIOR - GCM 1ª CL",
    "LEONARDO MAXIMILIANO ANSELMO DA SILVA - GCM 1ª CL",
    "LOURIVAL COSTA DA SILVA - GCM 1ª CL",
    "LUCAS LOUREIRO MARTINS - GCM CL ESP",
    "LUIZ CARLOS GREGO - GCM CL ESP",
    "MARCELO BAPTISTA DE SOUSA - GCM 1ª CL",
    "MARCELO FARIAS - GCM 2ª CL",
    "MARCOS AUGUSTO FERREIRA - GCM CL ESP",
    "MARIA MARLI PEREIRA - GCM CL ESP",
    "MARINALDO LUIS PHILOMENO - GCM CL ESP",
    "MORGANA APARECIDA MODOLO - GCM CL ESP",
    "SELMA ANICE DE OLIVEIRA - GCM CL ESP",
    "SILVIO RENATO BUENO DE OLIVEIRA - GCM 1ª CL",
    "TANIA FERREIRA DE FREITAS - GCM CL ESP",
    "VALDIR JOSÉ DA SILVA - GCM CL ESP",
    "VITOR MOREIRA DE SOUZA - GCM 1ª CL",
];

const roles = ['Encarregado', 'Motorista', 'Auxiliar'];

type TeamMember = {
    name: string;
    bodyCam: boolean;
    role: string;
}

export function Step1GeneralData() {
  const [selectedMember, setSelectedMember] = useState('');
  const [team, setTeam] = useState<TeamMember[]>([]);


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

  const handleAddMember = () => {
    if (selectedMember && !team.find(m => m.name === selectedMember)) {
      setTeam([...team, { name: selectedMember, bodyCam: false, role: '' }]);
      setSelectedMember('');
    }
  };

  const handleRemoveMember = (memberName: string) => {
    setTeam(team.filter(member => member.name !== memberName));
  };
  
  const handleTeamMemberChange = (memberName: string, field: 'bodyCam' | 'role', value: string | boolean) => {
    setTeam(team.map(member => 
      member.name === memberName ? { ...member, [field]: value } : member
    ));
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
      
       {/* Equipe */}
       <div className="space-y-4">
        <h3 className="text-lg font-medium">Equipe</h3>
        <div className="space-y-2">
            <Label htmlFor="team-member">Membro da Equipe</Label>
            <div className="flex items-start gap-2">
                 <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger id="team-member">
                        <SelectValue placeholder="Selecione um membro..." />
                    </SelectTrigger>
                    <SelectContent>
                        {allTeamMembers.map((member) => (
                            <SelectItem key={member} value={member}>{member}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleAddMember} size="icon" variant="outline">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Adicionar</span>
                </Button>
            </div>
        </div>

        {team.length > 0 && (
            <div className="rounded-md border p-4 space-y-3">
                <h4 className="text-sm font-medium">Membros Selecionados:</h4>
                <ul className="space-y-4">
                    {team.map((member, index) => (
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
                                        onCheckedChange={(checked) => handleTeamMemberChange(member.name, 'bodyCam', checked)}
                                    />
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Label htmlFor={`role-${index}`} className='text-xs'>Cargo</Label>
                                    <Select 
                                        value={member.role}
                                        onValueChange={(value) => handleTeamMemberChange(member.name, 'role', value)}
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
                                <Button onClick={() => handleRemoveMember(member.name)} size="icon" variant="ghost" className="h-7 w-7">
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

    