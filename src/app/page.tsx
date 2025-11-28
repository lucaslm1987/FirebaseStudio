import { Shield } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import { FirebaseClientProvider } from '@/firebase';

export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-2xl font-semibold text-white">GCMobile</span>
        </div>
        <LoginForm />
      </div>
    </FirebaseClientProvider>
  );
}
