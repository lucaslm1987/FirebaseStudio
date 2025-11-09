
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { allTeamMembers, roles, viaturas, type TeamMember } from '../../occurrence/new/form-context';
import { PlusCircle, Trash2, User, Users, Car, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const activityFields = [
    { id: 'adolescentesApreendidos', label: 'Adolescentes Apreendidos' },
    { id: 'armasBrancasApreendidas', label: 'Armas Brancas Apreendidas' },
    { id: 'armasFogoApreendidas', label: 'Armas de Fogo Apreendidas' },
    { id: 'capturados', label: 'Capturados' },
    { id: 'flagrantes', label: 'Flagrantes' },
    { id: 'multasAmbientais', label: 'Multas Ambientais' },
    { id: 'multasTransito', label: 'Multas de Trânsito' },
    { id: 'notificacoesAmbientais', label: 'Notificações Ambientais' },
    { id: 'pessoasAbordadas', label: 'Pessoas Abordadas' },
    { id: 'pessoasPresas', label: 'Pessoas Presas' },
    { id: 'veiculosAbordados', label: 'Veículos Abordados' },
    { id: 'veiculosLocalizados', label: 'Veículos Localizados' },
] as const;

type ActivityData = {
    [key in typeof activityFields[number]['id']]: number;
}

export interface ServiceReportData {
    id: string;
    openingDate?: string;
    openingTime?: string;
    closingDate?: string;
    closingTime?: string;
    openingKm?: number;
    closingKm?: number;
    team: TeamMember[];
    vehicle?: string;
    activities: ActivityData;
}

const initialActivities: ActivityData = activityFields.reduce((acc, field) => {
    acc[field.id] = 0;
    return acc;
}, {} as ActivityData);

const getInitialData = (): ServiceReportData => ({
    id: `RSD-${Date.now()}`,
    team: [],
    activities: initialActivities,
    openingKm: 0,
    closingKm: 0,
});


export default function NewServiceReportPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<ServiceReportData>(getInitialData());
    const [selectedMember, setSelectedMember] = useState('');

    const kmTraveled = useMemo(() => {
        const start = formData.openingKm || 0;
        const end = formData.closingKm || 0;
        return end > start ? end - start : 0;
    }, [formData.openingKm, formData.closingKm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
        ...prev,
        [id]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
        }));
    };
    
    const handleSelectChange = (id: keyof ServiceReportData) => (value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleActivityChange = (id: keyof ActivityData, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        setFormData(prev => ({
            ...prev,
            activities: {
                ...prev.activities,
                [id]: numValue >= 0 ? numValue : 0,
            }
        }));
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
    
    const handleSave = () => {
        try {
            const savedReportsString = localStorage.getItem('serviceReports');
            const savedReports: ServiceReportData[] = savedReportsString ? JSON.parse(savedReportsString) : [];
            
            const existingReportIndex = savedReports.findIndex(report => report.id === formData.id);
            if (existingReportIndex !== -1) {
                savedReports[existingReportIndex] = formData;
            } else {
                savedReports.push(formData);
            }

            localStorage.setItem('serviceReports', JSON.stringify(savedReports));
            
            toast({
                title: 'Relatório Salvo!',
                description: 'O relatório de serviço foi salvo com sucesso.',
            });
            router.push('/dashboard/reports/service');
        } catch (error) {
            console.error("Failed to save service report:", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Salvar',
                description: 'Não foi possível salvar o relatório de serviço.',
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
            <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
            Criar Relatório de Serviço Diário
            </h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Turno</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="openingDate">Data da Abertura</Label>
                        <Input id="openingDate" type="date" value={formData.openingDate || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="openingTime">Hora da Abertura</Label>
                        <Input id="openingTime" type="time" value={formData.openingTime || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closingDate">Data do Encerramento</Label>
                        <Input id="closingDate" type="date" value={formData.closingDate || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closingTime">Hora do Encerramento</Label>
                        <Input id="closingTime" type="time" value={formData.closingTime || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="openingKm">KM Abertura</Label>
                        <Input id="openingKm" type="number" value={formData.openingKm || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closingKm">KM Encerramento</Label>
                        <Input id="closingKm" type="number" value={formData.closingKm || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2 self-end">
                        <Label>KM Percorrido no Turno</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {kmTraveled} km
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> Equipe
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                                {formData.team.map((member) => (
                                    <li key={member.name} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-md bg-muted/50">
                                        <div className="flex items-center gap-2 font-medium">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className='flex-1'>{member.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                             <div className="flex items-center gap-2">
                                                <Label htmlFor={`role-${member.name}`} className='text-xs'>Cargo</Label>
                                                <Select 
                                                    value={member.role}
                                                    onValueChange={(value) => updateTeamMember(member.name, 'role', value)}
                                                >
                                                    <SelectTrigger id={`role-${member.name}`} className="h-8 w-[120px] text-xs">
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" /> Viatura
                    </CardTitle>
                </CardHeader>
                 <CardContent>
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
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Atividades Policiais e Administrativas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {activityFields.map(field => (
                         <div key={field.id} className="space-y-2">
                            <Label htmlFor={field.id}>{field.label}</Label>
                            <Input
                                id={field.id}
                                type="number"
                                min="0"
                                value={formData.activities[field.id] || ''}
                                onChange={(e) => handleActivityChange(field.id, e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancelar
                </Button>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Relatório
                </Button>
            </div>
            </div>
        </main>
        </div>
    );
}

    