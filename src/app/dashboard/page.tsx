
import { DashboardCard } from '@/components/dashboard-card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  ClipboardList,
  ClipboardPlus,
  FilePlus2,
  FileText,
  Search,
  Ticket,
} from 'lucide-react';

export default function DashboardPage() {
  const features = [
    {
      title: 'Criar BO GCM',
      description: 'Registre uma nova ocorrência.',
      href: '/dashboard/reports/occurrence/new',
      Icon: FilePlus2,
    },
    {
      title: 'Consultar BO GCM',
      description: 'Pesquise ocorrências existentes.',
      href: '/dashboard/reports/occurrence',
      Icon: Search,
    },
    {
      title: 'Criar Relatório Diário',
      description: 'Elabore o relatório de serviço do dia.',
      href: '/dashboard/reports/service/new',
      Icon: ClipboardPlus,
    },
    {
      title: 'Consultar Relatório Diário',
      description: 'Acesse relatórios de serviço anteriores.',
      href: '/dashboard/reports/service',
      Icon: ClipboardList,
    },
    {
      title: 'Criar Talão',
      description: 'Emita um novo talão de ocorrência.',
      href: '/dashboard/summons/new',
      Icon: FileText,
    },
    {
      title: 'Consultar Talão',
      description: 'Busque por talões já emitidos.',
      href: '/dashboard/summons',
      Icon: Ticket,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl">
          Dashboard
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <DashboardCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              Icon={feature.Icon}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
