'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const runAuthCheck = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Token no encontrado. Por favor inicia sesión.');
        // Redirección con un pequeño delay para evitar conflicto con renderizado
        setTimeout(() => router.push('/login'), 100);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          toast.error('Sesión expirada. Inicia sesión nuevamente.');
          localStorage.removeItem('token');
          setTimeout(() => router.push('/login'), 100);
        }
      } catch {
        toast.error('Token inválido. Inicia sesión nuevamente.');
        localStorage.removeItem('token');
        setTimeout(() => router.push('/login'), 100);
      }
    };

    runAuthCheck();
  }, [router]);
};
