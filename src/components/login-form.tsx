
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
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !auth) {
      setIsVerifying(false);
      return;
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.localStorage.getItem('emailForSignIn');
      if (!storedEmail) {
        storedEmail = window.prompt(
          'Por favor, forneça seu e-mail para concluir o login.'
        );
      }
      
      if (storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            // onAuthStateChanged listener will handle redirect
          })
          .catch((error) => {
            console.error('Login failed:', error);
            toast.error('Falha no Login', {
                description: 'O link de login é inválido ou expirou. Por favor, tente novamente.',
            });
            router.replace('/'); 
            setIsVerifying(false);
          });
      } else {
        toast.error('Falha no Login', {
            description: 'O e-mail não foi encontrado para completar o login.',
        });
        router.replace('/');
        setIsVerifying(false);
      }
    } else {
        setIsVerifying(false);
    }
  }, [auth, router]);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);
  
  if (isUserLoading || isVerifying) {
      return (
          <div className="flex h-screen w-screen items-center justify-center">
              <p className="text-white">Carregando...</p>
          </div>
      )
  }

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);

    const actionCodeSettings = {
      url: window.location.origin, // Use origin for link resilience
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setIsLinkSent(true);
      toast.success('Link Enviado!', {
        description: 'Verifique sua caixa de entrada para o link de login.',
      });
    } catch (error) {
      console.error('Failed to send sign-in link:', error);
      toast.error('Erro', {
        description: 'Não foi possível enviar o link. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}
