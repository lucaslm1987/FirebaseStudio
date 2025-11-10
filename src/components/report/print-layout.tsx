
'use client';

import React from 'react';

interface PrintLayoutProps {
    title: string;
    reportId?: string;
    reportDate?: string;
    reportIdLabel?: string;
    children: React.ReactNode;
}

export function PrintLayout({ title, reportId, reportDate, reportIdLabel = 'Nº Ocorrência:', children }: PrintLayoutProps) {
    return (
        <div className="print-container">
            <header className="print-header">
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-sm text-muted-foreground">Guarda Civil Municipal</p>
                </div>
                <div className="text-right">
                    {reportId && <p><strong>{reportIdLabel}</strong> {reportId}</p>}
                    {reportDate && <p><strong>Data Comunicação:</strong> {reportDate}</p>}
                </div>
            </header>

            <main className="print-main-content">
                {children}
            </main>

            <footer className="print-footer">
                <div className="print-footer-content">
                    <span>Guarda Civil - Disque 153</span>
                </div>
                <hr className="print-footer-line" />
                <p>Rua José Bonifácio, 378, Centro, Cordeirópolis-SP, fone (19) 3546-5838</p>
            </footer>
        </div>
    );
}
