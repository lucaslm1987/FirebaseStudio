
'use client';

import React from 'react';
import { Shield } from 'lucide-react';

interface PrintLayoutProps {
    title: string;
    reportId?: string;
    reportDate?: string;
    reportIdLabel?: string;
    children: React.ReactNode;
}

export function PrintLayout({ title, reportId, reportDate, reportIdLabel = 'Nº Ocorrência:', children }: PrintLayoutProps) {
    return (
        <div className="print-container bg-white text-black">
            <header className="print-header">
                 <div className="print-logo">
                    <Shield className="h-12 w-12 text-black" />
                    <div>
                        <p className="font-bold">ESTADO DE SÃO PAULO</p>
                        <p className="font-bold">PREFEITURA MUNICIPAL DE CORDEIRÓPOLIS</p>
                        <p>Secretaria Municipal de Segurança, Trânsito e Defesa Civil</p>
                        <p className='font-semibold'>Guarda Civil Municipal</p>
                    </div>
                </div>
                <div className="print-header-details">
                    <h2 className="text-xl font-bold">{title}</h2>
                    {reportId && <p><strong>{reportIdLabel}</strong> {reportId}</p>}
                    {reportDate && <p><strong>Data Comunicação:</strong> {reportDate}</p>}
                </div>
            </header>

            <main className="print-main-content">
                {children}
            </main>

            <footer className="print-footer">
                <div className="print-footer-content">
                    <span>Guarda Civil Municipal - Disque 153</span>
                </div>
                <hr className="print-footer-line" />
                <p>Rua José Bonifácio, 378, Centro, Cordeirópolis-SP, fone (19) 3546-5838</p>
            </footer>
        </div>
    );
}
