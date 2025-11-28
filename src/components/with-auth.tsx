
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, type ComponentType } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isUserLoading && !user) {
        router.replace('/');
      }
    }, [isUserLoading, user, router]);

    if (isUserLoading || !user) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <p>Carregando...</p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}
