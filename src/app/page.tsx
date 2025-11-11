
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  // Effect to handle the sign-in link verification
  useEffect(() => {
    // Avoid running this logic on the server or if auth is not ready.
    if (typeof window === 'undefined' || !auth) {
      return;
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.localStorage.getItem('emailForSignIn');
      if (!storedEmail) {
        // If email is not in storage, prompt the user for it.
        // This can happen if the user opens the link on a different device.
        storedEmail = window.prompt(
          'Por favor, forneça seu e-mail para concluir o login.'
        );
      }
      
      if (storedEmail) {
        setIsLoading(true);
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            // The onAuthStateChanged listener in FirebaseProvider will handle the redirect.
          })
          .catch((error) => {
            console.error('Login failed:', error);
            toast({
              variant: 'destructive',
              title: 'Falha no Login',
              description: 'O link de login é inválido ou expirou.',
            });
            setIsLoading(false);
          });
      }
    }
  }, [auth, toast]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setIsLinkSent(true);
      toast({
        title: 'Link Enviado!',
        description: 'Verifique sua caixa de entrada para o link de login.',
      });
    } catch (error) {
      console.error('Failed to send sign-in link:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar o link. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
      return (
          <div className="flex h-screen w-screen items-center justify-center">
              <p>Carregando...</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[url('/pcar.png')] bg-cover bg-center">
      <div className="min-h-screen w-full flex-col items-center justify-center bg-black/60 p-4 flex">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-2xl font-semibold text-white">GCMobile</span>
        </div>

        <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>Acessar Sistema</CardTitle>
            <CardDescription>
              {isLinkSent
                ? 'Um link de acesso foi enviado para o seu e-mail.'
                : 'Insira seu e-mail para receber um link de acesso.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLinkSent ? (
              <div className="text-center text-sm text-muted-foreground">
                <p>Verifique sua caixa de entrada (e a pasta de spam) e clique no link para fazer o login.</p>
              </div>
            ) : (
              <form onSubmit={handleSendLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@gcm.sp.gov.br"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Link de Acesso'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
