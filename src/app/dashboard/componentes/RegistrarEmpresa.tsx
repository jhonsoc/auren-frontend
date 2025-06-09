'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegistrarEmpresa() {
  const [form, setForm] = useState({
    nit: '',
    razonSocial: '',
    direccion: '',
    telefono: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log(token)
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
      setForm({ nit: '', razonSocial: '', direccion: '', telefono: '' });
    } catch {
      toast.error('Error al registrar empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Registrar Empresa</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">NIT</label>
          <input
            name="nit"
            placeholder="Ej: 900123456"
            value={form.nit}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Razón Social</label>
          <input
            name="razonSocial"
            placeholder="Ej: Soluciones Industriales"
            value={form.razonSocial}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Dirección</label>
          <input
            name="direccion"
            placeholder="Ej: Calle 123 #45-67"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input
            name="telefono"
            placeholder="Ej: 3101234567"
            value={form.telefono}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? 'bg-blue-300' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
