
'use client';

import type { InvolvedPerson } from '../form-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Trash2, Edit, LucideIcon, ShieldQuestion, UserCheck, UserX, UserCircle, UserSquare, MessageSquareText, Users, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface InvolvedPersonCardProps {
    person: InvolvedPerson;
    onEdit: () => void;
    onRemove: () => void;
}

const conditionIcons: Record<InvolvedPerson['condition'], LucideIcon> = {
    'Adolescente': User,
    'Autor': UserX,
    'Capturado': UserCheck,
    'Condutor': UserCircle,
    'Declarante': MessageSquareText,
    'Investigado': ShieldQuestion,
    'Parte': Users,
    'Representante': UserSquare,
    'Testemunha': User,
    'Vítima': User,
    '': HelpCircle
};

export function InvolvedPersonCard({ person, onEdit, onRemove }: InvolvedPersonCardProps) {
    const Icon = conditionIcons[person.condition] || HelpCircle;

    return (
        <Card className="flex flex-col sm:flex-row transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-start sm:items-center justify-between sm:justify-start gap-4 p-4 sm:w-2/5">
                <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-base font-semibold">{person.name}</CardTitle>
                        <CardDescription>{person.socialName || ' '}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{person.condition}</Badge>
                    <Badge variant="outline">{person.gender}</Badge>
                    {person.isConducted && <Badge>Conduzido</Badge>}
                    {person.isArrested && <Badge variant="destructive">Preso</Badge>}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
