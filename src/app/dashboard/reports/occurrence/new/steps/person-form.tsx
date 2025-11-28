
'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useOccurrenceForm, type InvolvedPerson } from '../form-context';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';

const conditions = ['Adolescente', 'Autor', 'Capturado', 'Condutor', 'Declarante', 'Investigado', 'Parte', 'Representante', 'Testemunha', 'Vítima'] as const;
const colors = ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena'] as const;
const educationLevels = ['Analfabeto', 'Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação'] as const;
const states = [ 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const;
const handcuffReasons = ['Receio de fuga', 'Perigo à integridade física de terceiros', 'Resistência'] as const;


const initialPersonState: Omit<InvolvedPerson, 'id' | 'type'> = {
    condition: '',
    name: '',
    socialName: '',
    rg: '',
    cpf: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    color: undefined,
    gender: undefined,
    profession: '',
    education: undefined,
    hasChildren: 'Não',
    childrenCount: 0,
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    acceptsElectronicNotification: 'Não',
    isConducted: false,
    isArrested: false,
    useHandcuffs: false,
    handcuffReason: undefined,
    version: '',
};

interface PersonFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  personData?: InvolvedPerson;
}

const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};
  
const maskRG = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 9);
};

const maskDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');
};

const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
};


export function PersonForm({ isOpen, setIsOpen, personData }: PersonFormProps) {
  const { formData, addInvolved, updateInvolved } = useOccurrenceForm();
  const [person, setPerson] = useState<Omit<InvolvedPerson, 'id' | 'type'>>(initialPersonState);
  
  useEffect(() => {
    if (personData) {
      setPerson(personData);
    } else {
      setPerson(initialPersonState);
    }
  }, [personData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    let finalValue: string | number = value;

    if (id === 'cpf') finalValue = maskCPF(value);
    else if (id === 'rg') finalValue = maskRG(value);
    else if (id === 'birthDate') finalValue = maskDate(value);
    else if (id === 'phone') finalValue = maskPhone(value);
    else if (id === 'childrenCount') finalValue = value === '' ? 0 : parseInt(value, 10);
    
    setPerson(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof InvolvedPerson) => (value: string) => {
    setPerson(prev => ({ ...prev, [id]: value }));
  };
  
  const handleRadioChange = (id: keyof InvolvedPerson) => (value: string) => {
    const update: Partial<InvolvedPerson> = { [id]: value };
    if (id === 'hasChildren' && value === 'Não') {
      update.childrenCount = 0;
    }
    setPerson(prev => ({ ...prev, ...update }));
  };

  const handleSwitchChange = (id: keyof InvolvedPerson) => (checked: boolean) => {
     const update: Partial<InvolvedPerson> = { [id]: checked };
     if (id === 'useHandcuffs' && !checked) {
       update.handcuffReason = undefined;
     }
    setPerson(prev => ({ ...prev, ...update }));
  };

  const handleCopyAddress = () => {
    setPerson(prev => ({
        ...prev,
        street: formData?.street || '',
        number: formData?.number || '',
        neighborhood: formData?.neighborhood || '',
        complement: formData?.complement || '',
        city: formData?.city || '',
        state: formData?.state || '',
    }));
  }

  const handleSubmit = () => {
    if (personData) {
      updateInvolved(personData.id, person);
    } else {
      addInvolved({
        ...person,
        id: new Date().toISOString(),
        type: 'person',
      });
    }
    setIsOpen(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{personData ? 'Editar' : 'Adicionar'} Pessoa Física</DialogTitle>
          <DialogDescription>
            Preencha os dados do envolvido na ocorrência.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condição *</Label>
                <Select value={person.condition} onValueChange={handleSelectChange('condition')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input id="name" value={person.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="socialName">Nome Social</Label>
                    <Input id="socialName" value={person.socialName || ''} onChange={handleChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" placeholder="Apenas números" value={person.rg || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" value={person.cpf || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input id="birthDate" placeholder="dd/mm/aaaa" value={person.birthDate || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="gender">Sexo</Label>
                     <Select value={person.gender} onValueChange={handleSelectChange('gender')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fatherName">Pai</Label>
                    <Input id="fatherName" value={person.fatherName || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="motherName">Mãe</Label>
                    <Input id="motherName" value={person.motherName || ''} onChange={handleChange} />
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                     <Select value={person.color} onValueChange={handleSelectChange('color')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="profession">Profissão</Label>
                    <Input id="profession" value={person.profession || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="education">Escolaridade</Label>
                     <Select value={person.education} onValueChange={handleSelectChange('education')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                           {educationLevels.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="space-y-2">
                    <Label>Tem filhos?</Label>
                     <RadioGroup value={person.hasChildren} onValueChange={handleRadioChange('hasChildren')} className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Sim" id="f-sim" /><Label htmlFor="f-sim">Sim</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Não" id="f-nao" /><Label htmlFor="f-nao">Não</Label></div>
                    </RadioGroup>
                </div>
                {person.hasChildren === 'Sim' && (
                    <div className="space-y-2">
                        <Label htmlFor="childrenCount">Quantos?</Label>
                        <Input id="childrenCount" type="number" min="1" value={person.childrenCount || 1} onChange={handleChange} className="w-24"/>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
                <h3 className="text-md font-medium">Dados de Contato</h3>
                 <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                    <Copy className="mr-2 h-4 w-4" />
                    É o mesmo da ocorrência?
                 </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" value={person.street || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="number">Nº</Label>
                    <Input id="number" value={person.number || ''} onChange={handleChange} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" value={person.neighborhood || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" value={person.complement || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={person.city || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                     <Select value={person.state} onValueChange={handleSelectChange('state')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone/WhatsApp/Telegram</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" value={person.phone || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" value={person.email || ''} onChange={handleChange} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Aceita ser notificado por meio eletrônico?</Label>
                 <RadioGroup value={person.acceptsElectronicNotification} onValueChange={handleRadioChange('acceptsElectronicNotification')} className="flex gap-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Sim" id="notif-sim" /><Label htmlFor="notif-sim">Sim</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Não" id="notif-nao" /><Label htmlFor="notif-nao">Não</Label></div>
                </RadioGroup>
            </div>

            <h3 className="text-md font-medium border-t pt-4">Situação Legal</h3>
            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2"><Switch id="isConducted" checked={!!person.isConducted} onCheckedChange={handleSwitchChange('isConducted')} /><Label htmlFor="isConducted">Pessoa conduzida?</Label></div>
                <div className="flex items-center space-x-2"><Switch id="isArrested" checked={!!person.isArrested} onCheckedChange={handleSwitchChange('isArrested')} /><Label htmlFor="isArrested">Pessoa Presa?</Label></div>
                <div className="flex items-center space-x-2"><Switch id="useHandcuffs" checked={!!person.useHandcuffs} onCheckedChange={handleSwitchChange('useHandcuffs')} /><Label htmlFor="useHandcuffs">Uso de Algemas?</Label></div>
            </div>
             {person.useHandcuffs && (
                <div className="space-y-2">
                    <Label>Motivo do uso de algemas</Label>
                    <RadioGroup value={person.handcuffReason} onValueChange={handleRadioChange('handcuffReason')} className="flex flex-wrap gap-4">
                        {handcuffReasons.map(reason => (
                            <div key={reason} className="flex items-center space-x-2"><RadioGroupItem value={reason} id={`hr-${reason}`} /><Label htmlFor={`hr-${reason}`}>{reason}</Label></div>
                        ))}
                    </RadioGroup>
                </div>
            )}

            <h3 className="text-md font-medium border-t pt-4">Versão do Envolvido</h3>
             <div className="space-y-2">
                <Textarea id="version" placeholder="Digite a versão do envolvido..." rows={5} value={person.version || ''} onChange={handleChange}/>
             </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{personData ? 'Salvar Alterações' : 'Adicionar Envolvido'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    

    