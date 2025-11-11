
'use client';

import { PrintLayout } from '@/components/report/print-layout';
import type { ServiceReportData } from './new/page';
import { format } from 'date-fns';
import { Users, Clock, Activity, Pen, BookText } from 'lucide-react';

interface ServiceReportPrintProps {
    reportData: ServiceReportData;
}

const PrintSection = ({ title, children, icon: Icon, className }: { title: string, children: React.ReactNode, icon?: React.ElementType, className?: string }) => {
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

const formatDate = (date?: string) => {
    if (!date) return 'Não informado';
    try {
        const dateObj = new Date(date);
        const dateWithOffset = new Date(dateObj.valueOf() + dateObj.getTimezoneOffset() * 60 * 1000);
        return format(dateWithOffset, 'dd/MM/yyyy');
    } catch {
        return date;
    }
};

const formatDateTime = (date?: string, time?: string) => {
    if (!date) return 'Não informado';
    const datePart = formatDate(date);
    return `${datePart} às ${time || 'hh:mm'}`;
};

export function ServiceReportPrint({ reportData }: ServiceReportPrintProps) {
    const { team, activities } = reportData;

    const kmTraveled = (reportData.closingKm || 0) - (reportData.openingKm || 0);

    const activityFields = [
        { id: 'pessoasAbordadas', label: 'Pessoas Abordadas' },
        { id: 'veiculosAbordados', label: 'Veículos Abordados' },
        { id: 'veiculosLocalizados', label: 'Veículos Localizados' },
        { id: 'capturados', label: 'Capturados' },
        { id: 'flagrantes', label: 'Flagrantes' },
        { id: 'adolescentesApreendidos', label: 'Adolescentes Apreendidos' },
        { id: 'pessoasPresas', label: 'Pessoas Presas' },
        { id: 'armasBrancasApreendidas', label: 'Armas Brancas Apreendidas' },
        { id: 'armasFogoApreendidas', label: 'Armas de Fogo Apreendidas' },
        { id: 'multasAmbientais', label: 'Multas Ambientais' },
        { id: 'multasTransito', label: 'Multas de Trânsito' },
        { id: 'notificacoesAmbientais', label: 'Notificações Ambientais' },
    ] as const;
    
    // Group activities into pairs for the two-column layout
    const activityPairs: Array<[typeof activityFields[number], (typeof activityFields[number] | undefined)]> = [];
    for (let i = 0; i < activityFields.length; i += 2) {
        activityPairs.push([activityFields[i], activityFields[i + 1]]);
    }

    return (
        <PrintLayout
            title="Relatório de Serviço Diário"
        >
            <PrintSection title="Turno" icon={Clock}>
                <div className="grid grid-cols-2 gap-x-4">
                    <p><strong>Abertura:</strong> {formatDateTime(reportData.openingDate, reportData.openingTime)}</p>
                    <p><strong>Encerramento:</strong> {formatDateTime(reportData.closingDate, reportData.closingTime)}</p>
                    <p><strong>KM Abertura:</strong> {reportData.openingKm || 0}</p>
                    <p><strong>KM Encerramento:</strong> {reportData.closingKm || 0}</p>
                    <p className="col-span-2"><strong>KM Percorrido:</strong> {kmTraveled > 0 ? kmTraveled : 0} km</p>
                </div>
            </PrintSection>

            <PrintSection title="Equipe e Viatura" icon={Users}>
                <table className="print-table w-full">
                    <thead>
                        <tr>
                            <th className="w-2/3">Nome</th>
                            <th>Função</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map(member => (
                            <tr key={member.name}>
                                <td>{member.name}</td>
                                <td>{member.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-2">
                    <p><strong>Viatura:</strong> {reportData.vehicle || 'Não informada'}</p>
                </div>
            </PrintSection>

            
            <PrintSection title="Atividades Policiais e Administrativas" icon={Activity}>
                 <div className="grid grid-cols-2 gap-x-8">
                    {activityFields.map((field) => (
                        <div key={field.id} className="flex justify-between py-1 border-b border-dashed border-gray-300">
                            <span className="font-semibold">{field.label}</span>
                            <span>{activities?.[field.id] || 0}</span>
                        </div>
                    ))}
                 </div>
            </PrintSection>
            
            {reportData.notes && (
                 <PrintSection title="Observações Gerais" icon={BookText}>
                    <p className="whitespace-pre-wrap">{reportData.notes}</p>
                </PrintSection>
            )}

            <PrintSection title="AUTENTICAÇÃO" icon={Pen}>
                <div className="print-signatures-grid">
                    {team.map(m => (
                        <div key={m.name} className="print-signature-box">
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-xs">{m.role}</p>
                        </div>
                    ))}
                </div>
            </PrintSection>

        </PrintLayout>
    );
}
