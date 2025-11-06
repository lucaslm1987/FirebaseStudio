
'use client';

import { useOccurrenceForm } from '../form-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step3Involved() {
  const { formData, updateField } = useOccurrenceForm();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField({ [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="involved">Pessoas Envolvidas</Label>
            <Textarea
                id="involved"
                placeholder="Liste todas as pessoas envolvidas (vítimas, testemunhas, autores), seus documentos e tipo de envolvimento."
                rows={8}
                value={formData.involved || ''}
                onChange={handleChange}
                required
            />
        </div>
    </div>
  );
}
