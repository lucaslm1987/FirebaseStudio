
'use client';

import type { ObjectItem } from '../form-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ObjectCardProps {
    object: ObjectItem;
    onEdit: () => void;
    onRemove: () => void;
}

export function ObjectCard({ object, onEdit, onRemove }: ObjectCardProps) {
    const title = [object.brand, object.model].filter(Boolean).join(' ') || 'Objeto não identificado';
    const description = `${object.quantity || 1} ${object.unit || 'unidade'}`;

    return (
        <Card className="flex flex-col sm:flex-row transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-start sm:items-center justify-between sm:justify-start gap-4 p-4 sm:w-2/5">
                <div className="flex items-center gap-4">
                    <Box className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{object.condition}</Badge>
                    <Badge variant="outline">{description}</Badge>
                    {object.color && <Badge variant="outline">{object.color}</Badge>}
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
