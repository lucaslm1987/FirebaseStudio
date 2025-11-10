
'use client';

import { PrintLayout } from '@/components/report/print-layout';
import type { SummonsData } from './new/page';
import { format } from 'date-fns';
import { Users, Clock, FileText, Pen } from 'lucide-react';

interface SummonsPrintProps {
    summonsData: SummonsData;
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

export function SummonsPrint({ summonsData }: SummonsPrintProps) {
    const { team } = summonsData;

    const kmTraveled = (summonsData.closingKm || 0) - (summonsData.openingKm || 0);

    return (
        <PrintLayout
            title="Talão de Atendimento"
            reportId={summonsData.id}
            reportIdLabel="Nº Talão:"
        >
            <PrintSection title="Turno" icon={Clock}>
                <div className="grid grid-cols-2 gap-x-4">
                    <p><strong>Abertura:</strong> {formatDateTime(summonsData.openingDate, summonsData.openingTime)}</p>
                    <p><strong>Encerramento:</strong> {formatDateTime(summonsData.closingDate, summonsData.closingTime)}</p>
                    <p><strong>KM Abertura:</strong> {summonsData.openingKm || 0}</p>
                    <p><strong>KM Encerramento:</strong> {summonsData.closingKm || 0}</p>
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
                    <p><strong>Viatura:</strong> {summonsData.vehicle || 'Não informada'}</p>
                </div>
            </PrintSection>
            
            <PrintSection title="Descrição do Atendimento / Deslocamento" icon={FileText} className="min-h-[200px]">
                <p className="whitespace-pre-wrap">{summonsData.description}</p>
            </PrintSection>

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
