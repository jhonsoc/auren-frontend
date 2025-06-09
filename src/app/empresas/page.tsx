'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegistrarEmpresaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    nit: '',
    email: '',
    telefono: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (!res.ok) throw new Error('Error al crear la empresa');

      toast.success('Empresa registrada exitosamente');
      setTimeout(() => {
        router.push('/empresas');
      }, 1500);
    } catch (err) {
      toast.error('Error al crear empresa. Revisa los datos.');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Registrar Empresa</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... campos igual que antes ... */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nombre</label>
          <input
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">NIT</label>
          <input
            name="nit"
            required
            value={form.nit}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
          <input
            name="telefono"
            required
            value={form.telefono}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
