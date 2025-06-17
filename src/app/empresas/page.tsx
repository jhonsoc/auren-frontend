/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Empresa {
  id: number;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
}

export default function ListarEmpresasPage() {
  useAuthGuard();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEmpresas = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setEmpresas(data);
      } catch {
        toast.error('Error al cargar empresas.');
      }
    };

    fetchEmpresas();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Empresas Registradas</h2>

      <table className="w-full border border-gray-300 rounded text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">NIT</th>
            <th className="p-2">Email</th>
            <th className="p-2">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
            <tr key={empresa.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{empresa.nombre}</td>
              <td className="p-2">{empresa.nit}</td>
              <td className="p-2">{empresa.email}</td>
              <td className="p-2">{empresa.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
