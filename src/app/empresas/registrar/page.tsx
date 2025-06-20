'use client';

import { useState } from 'react';
import type { Empresa } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function RegistrarEmpresaPage() {
  useAuthGuard();
  const router = useRouter();

  const [form, setForm] = useState<Omit<Empresa, 'id'>>({
    nit: '',
    razonSocial: '',
    direccion: '',
    telefono: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    const { nit, razonSocial, direccion, telefono } = form;
    if (!nit || !razonSocial || !direccion || !telefono) {
      toast.error('Todos los campos son obligatorios.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success('Empresa registrada exitosamente');
      setTimeout(() => router.push('/empresas'), 1500);
    } catch {
      toast.error('Error al registrar empresa. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Registrar Empresa</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(
          ['nit', 'razonSocial', 'direccion', 'telefono'] as (keyof typeof form)[]
        ).map((campo) => (
          <div key={campo}>
            <label className="block text-sm text-gray-700 mb-1 capitalize">
              {campo}
            </label>
            <input
              name={campo}
              value={form[campo as keyof typeof form]}
              onChange={handleChange}
              type='text'
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
              disabled={loading}
            />
          </div>
        ))}

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            } text-white px-4 py-2 rounded transition`}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
