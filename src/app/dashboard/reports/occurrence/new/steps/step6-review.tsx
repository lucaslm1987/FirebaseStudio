
'use client';

import { useOccurrenceForm } from '../form-context';

export function Step6Review() {
  const { formData } = useOccurrenceForm();

  const getSolutionText = () => {
    if (formData.solutionType === 'police_station') {
      return `Delegacia de Polícia (BO PC: ${formData.solutionPoliceReport || 'Não informado'})`;
    }
    return 'BO para registro';
  };

  return (
    <div className="space-y-6">
        <h3 className="text-lg font-medium">Revisão e Encerramento</h3>
        <p className="text-muted-foreground">
            Revise todas as informações inseridas nas etapas anteriores. Ao clicar em "Finalizar e Gerar BO",
            a ocorrência será salva permanentemente no sistema e um número de protocolo, QR Code e versão em PDF serão gerados.
        </p>
        <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="font-semibold mb-4">Resumo da Ocorrência</h4>
            <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                    <p><strong>Data do Fato:</strong> {formData.factDate}</p>
                    <p><strong>Hora do Fato:</strong> {formData.factTime}</p>
                    <p><strong>Origem:</strong> {formData.requestOrigin}</p>
                    <p><strong>Autoria:</strong> {formData.authorship}</p>
                </div>
                 <p><strong>Local:</strong> {`${formData.street}, ${formData.number}, ${formData.neighborhood}, ${formData.city}-${formData.state}`}</p>
                 <div>
                    <p><strong>Equipe:</strong></p>
                    <ul className="list-disc pl-5">
                        {formData.team.map(m => <li key={m.name}>{m.name} ({m.role})</li>)}
                    </ul>
                 </div>
                 <p><strong>Viatura:</strong> {formData.vehicle}</p>
                 <p><strong>Natureza:</strong> {formData.nature}</p>
                 <div>
                    <p className="font-semibold">Narrativa:</p>
                    <p className="whitespace-pre-wrap">{formData.narrative}</p>
                 </div>
                 <div>
                    <p><strong>Solução:</strong> {getSolutionText()}</p>
                 </div>
            </div>
        </div>
    </div>
  );
}
