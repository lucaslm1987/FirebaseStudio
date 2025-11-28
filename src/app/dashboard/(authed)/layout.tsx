
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const auth = useAuth();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/');
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-sm px-4 sm:px-6 print:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">GCMobile</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>
      <main className="flex-1 overflow-auto bg-transparent">{children}</main>
      <footer className="flex h-10 items-center justify-center border-t bg-card/80 backdrop-blur-sm px-6 print:hidden">
        <p className="text-xs text-muted-foreground">
            Secretaria de Segurança Pública de Cordeirópolis-SP
        </p>
      </footer>
    </div>
  );
}
