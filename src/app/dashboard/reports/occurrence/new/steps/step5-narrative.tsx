
'use client';

import { useOccurrenceForm } from '../form-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step5Narrative() {
  const { formData, updateField } = useOccurrenceForm();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField({ [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="narrative">Narrativa dos Fatos e Solução</Label>
            <Textarea
                id="narrative"
                placeholder="Descreva a cronologia dos fatos, desde o conhecimento inicial até o desfecho. Inclua as ações tomadas pela equipe."
                rows={12}
                value={formData.narrative || ''}
                onChange={handleChange}
                required
            />
        </div>
    </div>
  );
}
