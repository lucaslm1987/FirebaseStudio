
import { Shield } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';
import { FirebaseClientProvider } from '@/firebase';

export default function LoginPage() {
  const loginBackground = imageData.loginBackground;
  return (
    <FirebaseClientProvider>
      <div className="relative min-h-screen w-full">
        <Image
          src={loginBackground.src}
          alt={loginBackground.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          data-ai-hint={loginBackground['data-ai-hint']}
        />
        <div className="absolute inset-0 flex min-h-screen w-full flex-col items-center justify-center bg-black/60 p-4">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <span className="text-2xl font-semibold text-white">GCMobile</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
