
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Step2Nature() {
  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="nature">Natureza da Ocorrência</Label>
            <Input id="nature" placeholder="Ex: Furto, Roubo, Agressão, Perturbação do sossego" required />
        </div>
        <p className="text-sm text-muted-foreground">
            Selecione ou descreva a principal natureza da ocorrência. Você poderá adicionar naturezas secundárias se necessário.
        </p>
    </div>
  );
}
