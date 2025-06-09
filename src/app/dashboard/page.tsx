/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    documento: string;
    rol: string;
    nombre?: string; // Si decides incluir nombre en el token en el futuro
}

export default function DashboardPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<JwtPayload | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            setUsuario(decoded);
        } catch (err) {
            console.error('Token inválido', err);
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [router]);

    return (
         <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard General</h1>
      <p className="text-gray-600">Aquí irá la visualización de estadísticas, accesos rápidos y módulos.</p>
    </div>
    );
}

