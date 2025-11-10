
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { allTeamMembers, roles, viaturas, type TeamMember } from '../../reports/occurrence/new/form-context';
import { PlusCircle, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export interface SummonsData {
    id: string;
    openingDate?: string;
    openingTime?: string;
    closingDate?: string;
    closingTime?: string;
    openingKm?: number;
    closingKm?: number;
    team: TeamMember[];
    vehicle?: string;
    description?: string;
}

const generateNewId = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    return `${randomNumber}-${year}`;
};

const getInitialData = (): Omit<SummonsData, 'id'> => ({
    team: [],
    openingKm: 0,
    closingKm: 0,
});

// Helper function to clean data for Firestore
const cleanDataForFirestore = (data: any): any => {
    if (data === undefined) {
        return null;
    }
    if (Array.isArray(data)) {
        return data.map(item => cleanDataForFirestore(item));
    }
    if (data !== null && typeof data === 'object' && !(data instanceof Date)) {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                if (value !== undefined) {
                    newData[key] = cleanDataForFirestore(value);
                }
            }
        }
        return newData;
    }
    if (data === '') {
        return null;
    }
    return data;
};


export default function NewSummonsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const [formData, setFormData] = useState<SummonsData>({ id: '', ...getInitialData() });
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        // Generate ID only on the client side to avoid hydration errors
        setFormData(prev => ({ ...prev, id: generateNewId() }));
    }, []);

    const kmTraveled = useMemo(() => {
        const start = formData.openingKm || 0;
        const end = formData.closingKm || 0;
        return end > start ? end - start : 0;
    }, [formData.openingKm, formData.closingKm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
        }));
    };
    
    const handleSelectChange = (id: keyof Omit<SummonsData, 'team' | 'description'>) => (value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const addTeamMember = useCallback((name: string) => {
        setFormData(prev => ({
            ...prev,
            team: [...prev.team, { name, bodyCam: false, role: '' }]
        }));
    }, []);

    const removeTeamMember = useCallback((name: string) => {
        setFormData(prev => ({
            ...prev,
            team: prev.team.filter(member => member.name !== name)
        }));
    }, []);

    const updateTeamMember = useCallback((name: string, field: keyof Omit<TeamMember, 'name'>, value: any) => {
        setFormData(prev => ({
            ...prev,
            team: prev.team.map(member =>
                member.name === name ? { ...member, [field]: value } : member
            )
        }));
    }, []);

    const handleAddMember = () => {
        if (selectedMember && !formData.team.find(m => m.name === selectedMember)) {
            addTeamMember(selectedMember);
            setSelectedMember('');
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        try {
            const cleanedData = cleanDataForFirestore(formData);
            const summonsDocRef = doc(firestore, 'summons', cleanedData.id);
            setDoc(summonsDocRef, cleanedData, { merge: true });
            
            toast({
                title: 'Talão Emitido!',
                description: `O talão ${formData.id} foi salvo com sucesso.`,
            });
            router.push('/dashboard/summons');
        } catch (error) {
            console.error("Failed to save summons:", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Salvar',
                description: 'Não foi possível salvar o talão.',
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
            <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
                <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
                    Criar Talão de Deslocamento
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                    Nº: {formData.id}
                </p>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Turno</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="openingDate">Data da Abertura</Label>
                                <Input id="openingDate" type="date" value={formData.openingDate || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="openingTime">Hora da Abertura</Label>
                                <Input id="openingTime" type="time" value={formData.openingTime || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2" />
                            <div className="space-y-2">
                                <Label htmlFor="closingDate">Data do Encerramento</Label>
                                <Input id="closingDate" type="date" value={formData.closingDate || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closingTime">Hora do Encerramento</Label>
                                <Input id="closingTime" type="time" value={formData.closingTime || ''} onChange={handleChange} />
                            </div>
                             <div className="space-y-2" />
                             <div className="space-y-2">
                                <Label htmlFor="openingKm">KM Abertura</Label>
                                <Input id="openingKm" type="number" value={formData.openingKm || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closingKm">KM Encerramento</Label>
                                <Input id="closingKm" type="number" value={formData.closingKm || ''} onChange={handleChange} />
                            </div>
                            <div className="space-y-2 self-end">
                                <Label>KM Percorrido</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {kmTraveled} km
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Equipe</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="team-member">Membro da Equipe</Label>
                                <div className="flex items-start gap-2">
                                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                                        <SelectTrigger id="team-member"><SelectValue placeholder="Selecione um membro..." /></SelectTrigger>
                                        <SelectContent>
                                            {allTeamMembers.map((member) => (
                                                <SelectItem key={member} value={member} disabled={formData.team.some(m => m.name === member)}>{member}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleAddMember} size="icon" variant="outline" type="button"><PlusCircle className="h-4 w-4" /><span className="sr-only">Adicionar</span></Button>
                                </div>
                            </div>
                            {formData.team.length > 0 && (
                                <div className="rounded-md border p-4 space-y-3">
                                    <ul className="space-y-4">
                                        {formData.team.map((member) => (
                                            <li key={member.name} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <div className="flex items-center gap-2 font-medium"><User className="h-4 w-4 text-muted-foreground" /><span className='flex-1'>{member.name}</span></div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`role-${member.name}`} className='text-xs'>Cargo</Label>
                                                        <Select value={member.role} onValueChange={(value) => updateTeamMember(member.name, 'role', value)}>
                                                            <SelectTrigger id={`role-${member.name}`} className="h-8 w-[120px] text-xs"><SelectValue placeholder="Cargo..." /></SelectTrigger>
                                                            <SelectContent>{roles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button onClick={() => removeTeamMember(member.name)} size="icon" variant="ghost" className="h-7 w-7" type="button"><Trash2 className="h-4 w-4 text-destructive" /><span className="sr-only">Remover</span></Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Viatura</CardTitle></CardHeader>
                        <CardContent>
                            <div className="w-full max-w-xs">
                                <Label htmlFor="vehicle">Viatura</Label>
                                <Select value={formData.vehicle} onValueChange={handleSelectChange('vehicle')}>
                                    <SelectTrigger id="vehicle"><SelectValue placeholder="Selecione a viatura..." /></SelectTrigger>
                                    <SelectContent>{viaturas.map((vtr) => (<SelectItem key={vtr} value={vtr}>{vtr}</SelectItem>))}</SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle>Descrição do Atendimento / Deslocamento</CardTitle></CardHeader>
                        <CardContent>
                            <Textarea
                                id="description"
                                placeholder="Descreva o atendimento, deslocamento ou averiguação realizada."
                                rows={8}
                                maxLength={800}
                                value={formData.description || ''}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-right">{formData.description?.length || 0} / 800</p>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button type="submit">Emitir Talão</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
