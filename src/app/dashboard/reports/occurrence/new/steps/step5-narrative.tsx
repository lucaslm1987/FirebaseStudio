
'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step5Narrative() {
  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="narrative">Narrativa dos Fatos e Solução</Label>
            <Textarea
                id="narrative"
                placeholder="Descreva a cronologia dos fatos, desde o conhecimento inicial até o desfecho. Inclua as ações tomadas pela equipe."
                rows={12}
                required
            />
        </div>
    </div>
  );
}
