
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // O cookie `AuthToken` é um nome genérico para o cookie de autenticação do Firebase.
  // O Firebase Auth SDK (cliente) gerencia isso automaticamente.
  // Nós apenas precisamos verificar sua existência.
  const authToken = request.cookies.get('AuthToken') || request.cookies.get('__session');

  // Se o usuário está tentando acessar o dashboard e não tem um token, redirecione para o login.
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authToken) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('redirected', 'true');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// O matcher garante que este middleware seja executado apenas nas rotas do dashboard.
export const config = {
  matcher: '/dashboard/:path*',
}
