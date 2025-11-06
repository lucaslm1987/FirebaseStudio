
'use client';

import { useOccurrenceForm } from '../form-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Step4Items() {
  const { formData, updateField } = useOccurrenceForm();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField({ [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="items">Veículos, Objetos, Entorpecentes e Armas</Label>
            <Textarea
                id="items"
                placeholder="Liste e descreva detalhadamente quaisquer itens relevantes para a ocorrência, como veículos (placa, modelo), objetos (número de série), etc."
                rows={8}
                value={formData.items || ''}
                onChange={handleChange}
            />
        </div>
    </div>
  );
}
