
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ClipboardList,
  ClipboardPlus,
  FilePlus2,
  FileTicket,
  LayoutDashboard,
  LogOut,
  Search,
  Shield,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">GCMobile</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Dashboard" isActive={isActive('/dashboard')}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/reports/occurrence/new" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Criar BO"
                  isActive={isActive('/dashboard/reports/occurrence/new')}
                >
                  <FilePlus2 />
                  <span>Criar BO GCM</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/reports/occurrence" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Consultar BO"
                  isActive={isActive('/dashboard/reports/occurrence')}
                >
                  <Search />
                  <span>Consultar BO GCM</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/reports/service/new" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Criar Relatório"
                  isActive={isActive('/dashboard/reports/service/new')}
                >
                  <ClipboardPlus />
                  <span>Criar Rel. Diário</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/reports/service" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Consultar Relatório"
                  isActive={isActive('/dashboard/reports/service')}
                >
                  <ClipboardList />
                  <span>Consultar Rel. Diário</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/dashboard/summons/new" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Criar Talão"
                  isActive={isActive('/dashboard/summons/new')}
                >
                  <FileTicket />
                  <span>Criar Talão</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/summons" passHref legacyBehavior>
                <SidebarMenuButton
                  tooltip="Consultar Talão"
                  isActive={isActive('/dashboard/summons')}
                >
                  <Ticket />
                  <span>Consultar Talão</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="user avatar" />
                <AvatarFallback>OS</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-medium">Oficial Silva</span>
            </div>
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                aria-label="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
