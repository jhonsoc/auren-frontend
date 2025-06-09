'use client';

import { useState, useEffect } from 'react';

interface Props {
  empresa: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditarEmpresaModal({ empresa, onClose, onUpdate }: Props) {
  const [form, setForm] = useState(empresa);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas/${empresa.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      onUpdate();
      onClose();
    } else {
      alert('Error al actualizar empresa');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Editar Empresa</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {['nit', 'razonSocial', 'direccion', 'telefono'].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-600 capitalize">{field}</label>
              <input
                className="w-full border px-3 py-2 rounded"
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-700 text-white rounded"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
