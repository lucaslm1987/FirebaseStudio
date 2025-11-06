
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const features = [
    {
      title: 'Criar BO GCM',
      href: '/dashboard/reports/occurrence/new',
    },
    {
      title: 'Consultar BO GCM',
      href: '/dashboard/reports/occurrence',
    },
    {
      title: 'Criar Relatório Diário',
      href: '/dashboard/reports/service/new',
    },
    {
      title: 'Consultar Relatório Diário',
      href: '/dashboard/reports/service',
    },
    {
      title: 'Criar Talão',
      href: '/dashboard/summons/new',
    },
    {
      title: 'Consultar Talão',
      href: '/dashboard/summons',
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Sair',
      href: '/',
    }
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">GCMobile</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {features.map((feature) => (
              <DropdownMenuItem key={feature.title} asChild>
                <Link href={feature.href}>{feature.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <nav className="hidden items-center gap-4 md:flex">
          {features.slice(0, 6).map((feature) => (
             <Link
                key={feature.title}
                href={feature.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {feature.title}
              </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/">Sair</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
