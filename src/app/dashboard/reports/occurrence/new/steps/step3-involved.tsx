
'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step3Involved() {
  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="involved">Pessoas Envolvidas</Label>
            <Textarea
                id="involved"
                placeholder="Liste todas as pessoas envolvidas (vítimas, testemunhas, autores), seus documentos e tipo de envolvimento."
                rows={8}
                required
            />
        </div>
    </div>
  );
}
