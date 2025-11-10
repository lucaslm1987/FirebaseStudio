
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, LogOut, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // Wait until on the client and auth state is determined
    if (isClient && !isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router, isClient]);
  

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/');
  };
  
  // While loading on the client or if the user is not yet determined, show a loading state.
  // This prevents hydration errors and content flashing.
  if (!isClient || isUserLoading || !user) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <p>Carregando...</p>
        </div>
    )
  }

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
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/dashboard/intelligence">
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  INTEL GCM
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
