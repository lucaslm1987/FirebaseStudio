
import { Shield } from 'lucide-react';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[url('/pcar.png')] bg-cover bg-center">
      <div className="min-h-screen w-full flex-col items-center justify-center bg-black/60 p-4 flex">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-2xl font-semibold text-white">GCMobile</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
