'use client';

import type { ReactNode } from 'react';
import { FirebaseClientProvider } from '@/firebase';

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}
