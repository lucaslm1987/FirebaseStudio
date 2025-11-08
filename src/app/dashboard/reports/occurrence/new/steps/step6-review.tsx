
'use client';

import type { OccurrenceFormData } from '../form-context';
import { format } from 'date-fns';
import { 
    FileText, 
    Scale, 
    Users, 
    User, 
    Car, 
    Box, 
    Pill, 
    Target, 
    BookText, 
    Lightbulb, 
    Pen 
} from 'lucide-react';

const ReviewSection = ({ title, children, hasData, className, icon: Icon }: { title: string, children: React.ReactNode, hasData: boolean, className?: string, icon?: React.ElementType }) => {
    if (!hasData) return null;
    return (
        <section className={`print-section ${className}`}>
            <h5 className="print-section-title">
                {Icon && <Icon className="h-5 w-5 text-primary" />}
                <span>{title}</span>
            </h5>
            <div className="print-section-content">
                {children}
            </div>
        </section>
    );
};

const capitalize = (s?: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};


export function Step6Review({ formData }: { formData: OccurrenceFormData }) {

  const { involved, items, team } = formData;

  const getSolutionText = () => {
    if (formData.solutionType === 'police_station') {
      return `Delegacia de Polícia (BO PC: ${formData.solutionPoliceReport || 'Não informado'})`;
    }
    return 'BO para registro';
  };
  
  const formatDate = (date?: string) => {
    if (!date) return 'Não informado';
    try {
        const dateObj = new Date(date);
        const dateWithOffset = new Date(dateObj.valueOf() + dateObj.getTimezoneOffset() * 60 * 1000);
        return format(dateWithOffset, 'dd/MM/yyyy');
    } catch {
        return date;
    }
  }

  const formatDateTime = (date?: string, time?: string) => {
      if (!date) return 'Não informado';
      const datePart = formatDate(date);
      return `${datePart} às ${time || 'hh:mm'}`;
  }


  return (
    <div className="print-container">
        <header className="print-header">
            <div>
                 <h2 className="text-2xl font-bold">Boletim de Ocorrência</h2>
                 <p className="text-sm text-muted-foreground">Guarda Civil Municipal</p>
            </div>
            <div className="text-right">
                <p><strong>Nº Ocorrência:</strong> {formData.id || 'Não gerado'}</p>
                <p><strong>Data Comunicação:</strong> {formatDateTime(formData.communicationDate, formData.communicationTime)}</p>
            </div>
        </header>

        <main className="print-main-content">
            <ReviewSection title="Dados Gerais" hasData={true} icon={FileText}>
                 <div className="grid grid-cols-3 gap-x-4">
                    <p><strong>Data do Fato:</strong> {formatDateTime(formData.factDate, formData.factTime)}</p>
                    <p><strong>Origem da Solicitação:</strong> {capitalize(formData.requestOrigin)}</p>
                    <p><strong>Autoria:</strong> {capitalize(formData.authorship)}</p>
                    <p><strong>Flagrante:</strong> {formData.isFlagrant ? 'Sim' : 'Não'}</p>
                    <p><strong>Ato Infracional:</strong> {formData.isInfraction ? 'Sim' : 'Não'}</p>
                    <p><strong>Violência Doméstica:</strong> {formData.isDomesticViolence ? 'Sim' : 'Não'}</p>
                    <p className="col-span-3"><strong>Local:</strong> {`${formData.street || ''}, ${formData.number || 'S/N'}, ${formData.neighborhood || ''}, ${formData.city || ''}-${formData.state || ''}`}</p>
                </div>
            </ReviewSection>

            <ReviewSection title="Natureza da Ocorrência" hasData={!!formData.nature} icon={Scale}>
                <p>{formData.nature}</p>
            </ReviewSection>

            <ReviewSection title="Equipe de Atendimento" hasData={team && team.length > 0} icon={Users}>
                <table className="print-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Função</th>
                            <th>Bodycam</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map(member => (
                            <tr key={member.name}>
                                <td>{member.name}</td>
                                <td>{member.role}</td>
                                <td>{member.bodyCam ? 'Sim' : 'Não'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <p><strong>Viatura:</strong> {formData.vehicle || 'Não informada'}</p>
            </ReviewSection>

            <ReviewSection title="Envolvidos" hasData={involved && involved.length > 0} icon={User}>
                {involved.map(inv => (
                    <div key={inv.id} className="print-involved-card">
                        {inv.type === 'person' && (
                            <>
                                <div className="grid grid-cols-3 gap-x-4">
                                    <p><strong>Nome:</strong> {inv.name}</p>
                                    <p><strong>Nome Social:</strong> {inv.socialName || '--'}</p>
                                    <p><strong>Condição:</strong> {inv.condition}</p>
                                    
                                    <p><strong>Data Nasc.:</strong> {inv.birthDate || '--'}</p>
                                    <p><strong>Sexo:</strong> {inv.gender || '--'}</p>
                                    <p><strong>Cor:</strong> {inv.color || '--'}</p>

                                    <p><strong>RG:</strong> {inv.rg || '--'}</p>
                                    <p><strong>CPF:</strong> {inv.cpf || '--'}</p>
                                    <p><strong>Escolaridade:</strong> {inv.education || '--'}</p>

                                    <p><strong>Pai:</strong> {inv.fatherName || '--'}</p>
                                    <p><strong>Mãe:</strong> {inv.motherName || '--'}</p>
                                    <p><strong>Profissão:</strong> {inv.profession || '--'}</p>

                                    <p className="col-span-3"><strong>Endereço:</strong> {`${inv.street || ''}, ${inv.number || 'S/N'}, ${inv.neighborhood || ''}, ${inv.city || ''}-${inv.state || ''}`}</p>
                                    <p><strong>Telefone:</strong> {inv.phone || '--'}</p>
                                    <p><strong>Email:</strong> {inv.email || '--'}</p>
                                    <p><strong>Notificação Eletrônica:</strong> {inv.acceptsElectronicNotification || 'Não'}</p>

                                    <p><strong>Conduzido:</strong> {inv.isConducted ? 'Sim' : 'Não'}</p>
                                    <p><strong>Preso:</strong> {inv.isArrested ? 'Sim' : 'Não'}</p>
                                    <p><strong>Uso de Algemas:</strong> {inv.useHandcuffs ? `Sim (${inv.handcuffReason || ''})` : 'Não'}</p>
                                </div>
                                {inv.version && <div className="mt-2"><strong>Versão:</strong> <span className="font-normal">{inv.version}</span></div>}
                            </>
                        )}
                        {inv.type === 'company' && (
                             <div className="grid grid-cols-3 gap-x-4">
                                <p><strong>Razão Social:</strong> {inv.corporateName}</p>
                                <p><strong>Nome Fantasia:</strong> {inv.tradeName || '--'}</p>
                                <p><strong>Condição:</strong> {inv.condition}</p>
                                <p><strong>CNPJ:</strong> {inv.cnpj || '--'}</p>
                                <p className="col-span-2"><strong>Representante:</strong> {inv.representative || '--'}</p>
                                <p className="col-span-3"><strong>Endereço:</strong> {`${inv.street || ''}, ${inv.number || 'S/N'}, ${inv.neighborhood || ''}, ${inv.city || ''}-${inv.state || ''}`}</p>
                            </div>
                        )}
                    </div>
                ))}
            </ReviewSection>

            {items.vehicles.length > 0 && 
                <ReviewSection title="Veículos" hasData={true} icon={Car}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Condição</th>
                                <th>Tipo</th>
                                <th>Placa</th>
                                <th>Marca/Modelo</th>
                                <th>Cor</th>
                                <th>Ano</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.vehicles.map(v => (
                                <tr key={v.id}>
                                    <td>{v.condition}</td>
                                    <td>{v.type}</td>
                                    <td>{v.plate}</td>
                                    <td>{v.brand} {v.model}</td>
                                    <td>{v.color}</td>
                                    <td>{v.yearManufacture}/{v.yearModel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ReviewSection>
            }
            
            {items.objects.length > 0 &&
                <ReviewSection title="Objetos" hasData={true} icon={Box}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Condição</th>
                                <th>Descrição</th>
                                <th>Qtd.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.objects.map(o => (
                                <tr key={o.id}>
                                    <td>{o.condition}</td>
                                    <td>{o.brand || ''} {o.model || ''} {o.notes ? `- ${o.notes}` : ''}</td>
                                    <td>{o.quantity} {o.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ReviewSection>
            }

            {items.narcotics.length > 0 &&
                <ReviewSection title="Entorpecentes" hasData={true} icon={Pill}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Condição</th>
                                <th>Tipo</th>
                                <th>Qtd.</th>
                                <th>Embalagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.narcotics.map(n => (
                                <tr key={n.id}>
                                    <td>{n.condition}</td>
                                    <td>{n.type}</td>
                                    <td>{n.quantity} {n.unit}</td>
                                    <td>{n.packaging}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ReviewSection>
            }
            
            {items.weapons.length > 0 &&
                <ReviewSection title="Armas" hasData={true} icon={Target}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Condição</th>
                                <th>Tipo</th>
                                <th>Marca/Modelo</th>
                                <th>Nº Série</th>
                                <th>Calibre</th>
                                <th>Munições</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.weapons.map(w => (
                                <tr key={w.id}>
                                    <td>{w.condition}</td>
                                    <td>{w.type}</td>
                                    <td>{w.brand} {w.model}</td>
                                    <td>{w.serialNumber}</td>
                                    <td>{w.calibre}</td>
                                    <td>{w.ammoIntact} intactas, {w.ammoSpent} deflag.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ReviewSection>
            }
            
             <ReviewSection title="Narrativa" hasData={!!formData.narrative} icon={BookText}>
                <p className="whitespace-pre-wrap">{formData.narrative}</p>
            </ReviewSection>
            
            <ReviewSection title="Solução" hasData={true} icon={Lightbulb}>
                <p>{getSolutionText()}</p>
            </ReviewSection>
            
            <ReviewSection title="Assinaturas" hasData={true} icon={Pen}>
                <div className="print-signatures-grid">
                    {team.map(m => (
                        <div key={m.name} className="print-signature-box">
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-xs">{m.role}</p>
                        </div>
                    ))}
                </div>
            </ReviewSection>
        </main>

        <footer className="print-footer">
             <div className="print-footer-content">
                <span>Guarda Civil Municipal - 153</span>
            </div>
            <div className="print-footer-line"></div>
            <p>Rua José Bonifácio, 378, Centro, Cordeirópolis-SP, fone (19) 3546-5838</p>
        </footer>
    </div>
  );
}

    
