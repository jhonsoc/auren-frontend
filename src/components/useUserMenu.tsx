'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  nombre: string;
  rol: string;
  exp: number;
}

export const useUserData = () => {
  const [nombre, setNombre] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setNombre(decoded.nombre || 'Usuario');
    } catch {
      // Token inválido, cerrar sesión automáticamente
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { nombre, logout };
};
