'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import type { FormData, InvolvedCompany } from '@/types/form';
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
import { Copy } from 'lucide-react';

const conditions = ['Autor', 'Investigado', 'Vítima'] as const;
const states = [ 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const;

const initialCompanyState: Omit<InvolvedCompany, 'id' | 'type'> = {
    condition: '',
    corporateName: '',
    tradeName: '',
    cnpj: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    representative: '',
};

interface CompanyFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  companyData?: InvolvedCompany;
  addInvolved: (involved: InvolvedCompany) => void;
  updateInvolved: (id: string, data: Partial<InvolvedCompany>) => void;
  formData: FormData;
}

const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
};

export function CompanyForm({ isOpen, setIsOpen, companyData, addInvolved, updateInvolved, formData }: CompanyFormProps) {
  const [company, setCompany] = useState<Omit<InvolvedCompany, 'id' | 'type'>>(initialCompanyState);
  
  useEffect(() => {
    if (companyData) {
      setCompany(companyData);
    } else {
      setCompany(initialCompanyState);
    }
  }, [companyData, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let finalValue = value;

    if (id === 'cnpj') finalValue = maskCNPJ(value);
    else if (id === 'phone') finalValue = maskPhone(value);
    
    setCompany(prev => ({ ...prev, [id]: finalValue }));
  };

  const handleSelectChange = (id: keyof InvolvedCompany) => (value: string) => {
    setCompany(prev => ({ ...prev, [id]: value }));
  };

  const handleCopyAddress = () => {
    setCompany(prev => ({
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
    if (companyData) {
      updateInvolved(companyData.id, company);
    } else {
      addInvolved({
        ...company,
        id: new Date().toISOString(),
        type: 'company',
      });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{companyData ? 'Editar' : 'Adicionar'} Pessoa Jurídica</DialogTitle>
          <DialogDescription>
            Preencha os dados da empresa envolvida na ocorrência.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condição *</Label>
                <Select value={company.condition} onValueChange={handleSelectChange('condition')} required>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="corporateName">Razão Social *</Label>
                    <Input id="corporateName" value={company.corporateName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tradeName">Nome Fantasia</Label>
                    <Input id="tradeName" value={company.tradeName || ''} onChange={handleChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="00.000.000/0000-00" value={company.cnpj || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="representative">Representante</Label>
                    <Input id="representative" value={company.representative || ''} onChange={handleChange} />
                </div>
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
                    <Input id="street" value={company.street || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="number">Nº</Label>
                    <Input id="number" value={company.number || ''} onChange={handleChange} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" value={company.neighborhood || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" value={company.complement || ''} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={company.city || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                     <Select value={company.state} onValueChange={handleSelectChange('state')}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" value={company.phone || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" value={company.email || ''} onChange={handleChange} />
                </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{companyData ? 'Salvar Alterações' : 'Adicionar Empresa'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
