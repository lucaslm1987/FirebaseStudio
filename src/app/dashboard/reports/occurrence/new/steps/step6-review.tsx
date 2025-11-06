
'use client';

export function Step6Review() {
  return (
    <div className="space-y-6">
        <h3 className="text-lg font-medium">Revisão e Encerramento</h3>
        <p className="text-muted-foreground">
            Revise todas as informações inseridas nas etapas anteriores. Ao clicar em "Finalizar e Gerar BO",
            a ocorrência será salva permanentemente no sistema e um número de protocolo, QR Code e versão em PDF serão gerados.
        </p>
        <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="font-semibold mb-4">Resumo da Ocorrência</h4>
            <div className="space-y-4">
               {/* Aqui vamos exibir um resumo de todos os dados inseridos. */}
               <p className="text-sm text-center py-8">
                (Resumo dos dados das etapas 1 a 5 será exibido aqui)
               </p>
            </div>
        </div>

    </div>
  );
}
