
'use client';

import { useOccurrenceForm } from '../form-context';
import { Badge } from '@/components/ui/badge';

const ReviewSection = ({ title, children, hasData }: { title: string, children: React.ReactNode, hasData: boolean }) => {
    if (!hasData) {
        return null;
    }
    return (
        <div className="border-t pt-4">
            <h5 className="font-semibold mb-2">{title}</h5>
            <div className="space-y-2 text-sm text-muted-foreground">
                {children}
            </div>
        </div>
    )
}

export function Step6Review() {
  const { formData } = useOccurrenceForm();
  const { involved, items } = formData;

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
                    <div><strong>Data do Fato:</strong> {formData.factDate || 'Não informado'}</div>
                    <div><strong>Hora do Fato:</strong> {formData.factTime || 'Não informado'}</div>
                    <div><strong>Origem:</strong> {formData.requestOrigin || 'Não informado'}</div>
                    <div><strong>Autoria:</strong> {formData.authorship || 'Não informado'}</div>
                </div>
                 <div><strong>Local:</strong> {`${formData.street || ''}, ${formData.number || ''}, ${formData.neighborhood || ''}, ${formData.city || ''}-${formData.state || ''}`}</div>
                 <div><strong>Viatura:</strong> {formData.vehicle || 'Não informado'}</div>
                 <div><strong>Natureza:</strong> {formData.nature || 'Não informado'}</div>
                 
                 <ReviewSection title="Envolvidos" hasData={involved.length > 0}>
                    {involved.map(inv => (
                        <div key={inv.id} className="p-2 rounded-md bg-background/50">
                            {inv.type === 'person' && (
                                <>
                                    <div className="flex items-center gap-2"><strong>{inv.name}</strong> <Badge variant="outline">{inv.condition}</Badge></div>
                                    <div>RG: {inv.rg || 'N/A'} - CPF: {inv.cpf || 'N/A'}</div>
                                    <div>Notificação Eletrônica: {inv.acceptsElectronicNotification || 'Não'}</div>
                                </>
                            )}
                            {inv.type === 'company' && (
                                <>
                                    <div className="flex items-center gap-2"><strong>{inv.corporateName}</strong> <Badge variant="outline">{inv.condition}</Badge></div>
                                    <div>CNPJ: {inv.cnpj || 'N/A'}</div>
                                </>
                            )}
                        </div>
                    ))}
                 </ReviewSection>

                 <ReviewSection title="Veículos" hasData={items.vehicles.length > 0}>
                    {items.vehicles.map(v => (
                        <div key={v.id} className="p-2 rounded-md bg-background/50">
                            <div className="flex items-center gap-2"><strong>{v.brand} {v.model}</strong> - Placa: {v.plate || 'N/A'} <Badge variant="outline">{v.condition}</Badge></div>
                        </div>
                    ))}
                 </ReviewSection>
                 
                 <ReviewSection title="Objetos" hasData={items.objects.length > 0}>
                    {items.objects.map(o => (
                        <div key={o.id} className="p-2 rounded-md bg-background/50">
                            <div className="flex items-center gap-2"><strong>{o.brand || ''} {o.model || 'Objeto'}</strong> - Qtd: {o.quantity} {o.unit} <Badge variant="outline">{o.condition}</Badge></div>
                        </div>
                    ))}
                 </ReviewSection>

                 <ReviewSection title="Entorpecentes" hasData={items.narcotics.length > 0}>
                    {items.narcotics.map(n => (
                        <div key={n.id} className="p-2 rounded-md bg-background/50">
                            <div className="flex items-center gap-2"><strong>{n.type}</strong> - Qtd: {n.quantity} {n.unit} ({n.packaging}) <Badge variant="outline">{n.condition}</Badge></div>
                        </div>
                    ))}
                 </ReviewSection>

                 <ReviewSection title="Armas" hasData={items.weapons.length > 0}>
                    {items.weapons.map(w => (
                        <div key={w.id} className="p-2 rounded-md bg-background/50">
                            <div className="flex items-center gap-2"><strong>{w.type} {w.brand} {w.model}</strong> - Cal: {w.calibre || 'N/A'} <Badge variant="outline">{w.condition}</Badge></div>
                        </div>
                    ))}
                 </ReviewSection>

                 <div>
                    <p className="font-semibold">Narrativa:</p>
                    <div className="whitespace-pre-wrap p-2 bg-background/50 rounded-md">{formData.narrative || 'Não informada'}</div>
                 </div>
                 
                 <div>
                    <strong>Solução:</strong> {getSolutionText()}
                 </div>
                 
                 <div className="border-t pt-4">
                    <p className="font-semibold mb-4">Equipe:</p>
                    <div className="space-y-8">
                        {formData.team.map(m => (
                            <div key={m.name} className="flex flex-col items-center">
                                <div className="w-full max-w-xs border-b border-foreground/50 text-center pb-1">
                                    <p className="font-semibold">{m.name}</p>
                                    <p className="text-xs text-muted-foreground">{m.role}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Assinatura</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
