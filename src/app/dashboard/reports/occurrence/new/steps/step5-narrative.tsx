
'use client';

import { useOccurrenceForm } from '../form-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

const maskPoliceReport = (value: string) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10)
      .replace(/^([A-Z]{2})(\d{0,4})?(\d{0,4})?$/, (match, p1, p2, p3) => {
          if (p3) {
              return `${p1}${p2}/${p3}`;
          }
          if (p2) {
              return `${p1}${p2}`;
          }
          return p1;
      });
};


export function Step5Narrative() {
  const { formData, updateField } = useOccurrenceForm();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { id, value } = e.target;
    let finalValue = value;
    if (id === 'solutionPoliceReport') {
      finalValue = maskPoliceReport(value);
    }
    updateField({ [id]: finalValue });
  };
  
  const handleRadioChange = (value: 'register' | 'police_station') => {
    updateField({ solutionType: value });
  };

  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="narrative">Narrativa dos Fatos</Label>
            <Textarea
                id="narrative"
                placeholder="Descreva a cronologia dos fatos, desde o conhecimento inicial até o desfecho. Inclua as ações tomadas pela equipe."
                rows={12}
                value={formData.narrative || ''}
                onChange={handleChange}
                required
            />
        </div>
        <div className="space-y-4">
            <Label>Solução</Label>
            <RadioGroup value={formData.solutionType} onValueChange={handleRadioChange} className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="register" id="sol-register" />
                    <Label htmlFor="sol-register">BO para registro</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="police_station" id="sol-police" />
                    <Label htmlFor="sol-police">Delegacia de Polícia</Label>
                </div>
            </RadioGroup>

            {formData.solutionType === 'police_station' && (
                <div className="space-y-2 pl-6 animate-in fade-in-0 slide-in-from-top-4 duration-300">
                    <Label htmlFor="solutionPoliceReport">Nº do BO da Polícia Civil</Label>
                    <Input
                        id="solutionPoliceReport"
                        placeholder="AB1234/2024"
                        value={formData.solutionPoliceReport || ''}
                        onChange={handleChange}
                        className="w-full max-w-xs"
                    />
                </div>
            )}
        </div>
    </div>
  );
}
