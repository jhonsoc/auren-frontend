'use client';

import { useEffect, useState } from 'react';
import EditarEmpresaModal from './EditarEmpresaModal';

interface Empresa {
  id: string;
  nit: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
}

export default function ListaEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa | null>(null);

  const cargarEmpresas = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setEmpresas)
      .catch(() => {});
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const eliminarEmpresa = async (id: string) => {
    if (!confirm('¿Deseas eliminar esta empresa?')) return;

    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    cargarEmpresas();
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Empresas Registradas</h2>
      <table className="min-w-full text-sm bg-white border rounded shadow">
        <thead className="bg-blue-100 text-blue-800 text-left">
          <tr>
            <th className="px-4 py-2">NIT</th>
            <th className="px-4 py-2">Razón Social</th>
            <th className="px-4 py-2">Dirección</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.length > 0 ? (
            empresas.map((e) => (
              <tr key={e.id} className="group border-t hover:bg-gray-50">
                <td className="px-4 py-2">{e.nit}</td>
                <td className="px-4 py-2">{e.razonSocial}</td>
                <td className="px-4 py-2">{e.direccion}</td>
                <td className="px-4 py-2">{e.telefono}</td>
                <td className="px-4 py-2">
                  <div className="invisible group-hover:visible flex gap-2">
                    <button
                      onClick={() => setEmpresaEditando(e)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarEmpresa(e.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No hay empresas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {empresaEditando && (
        <EditarEmpresaModal
          empresa={empresaEditando}
          onClose={() => setEmpresaEditando(null)}
          onUpdate={cargarEmpresas}
        />
      )}
    </div>
  );
}
