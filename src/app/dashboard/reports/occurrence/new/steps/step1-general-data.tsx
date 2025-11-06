
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Step1GeneralData() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
       <div className="space-y-2">
            <Label htmlFor="date">Data e Hora do Fato</Label>
            <Input id="date" type="datetime-local" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="location">Local da Ocorrência</Label>
            <Input
            id="location"
            placeholder="Endereço completo, ponto de referência..."
            required
            />
        </div>
    </div>
  );
}
