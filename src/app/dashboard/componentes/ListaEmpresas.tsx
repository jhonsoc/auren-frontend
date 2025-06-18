'use client';

import { useEffect, useState } from 'react';
import EditarEmpresaModal from './EditarEmpresaModal';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [filtroNIT, setFiltroNIT] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');

  const cargarEmpresas = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        throw new Error('Respuesta inválida del servidor');
      }

      setEmpresas(data);
    } catch (error) {
      toast.error('Error al cargar empresas');
      setEmpresas([]); // fallback seguro
      console.error(error);
    }
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

  const empresasFiltradas = empresas.filter((empresa) => {
    const nitMatch = empresa.nit.toLowerCase().includes(filtroNIT.toLowerCase());
    const nombreMatch = empresa.razonSocial.toLowerCase().includes(filtroNombre.toLowerCase());
    return nitMatch && nombreMatch;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Lista de Empresas</h2>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Filtrar por NIT"
          value={filtroNIT}
          onChange={(e) => setFiltroNIT(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Filtrar por razón social"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">NIT</th>
              <th className="border px-4 py-2 text-left">Razón Social</th>
              <th className="border px-4 py-2 text-left">Dirección</th>
              <th className="border px-4 py-2 text-left">Teléfono</th>
              <th className="border px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresasFiltradas.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-gray-50 group">
                <td className="border px-4 py-2">{empresa.nit}</td>
                <td className="border px-4 py-2">{empresa.razonSocial}</td>
                <td className="border px-4 py-2">{empresa.direccion}</td>
                <td className="border px-4 py-2">{empresa.telefono}</td>
                <td className="border px-4 py-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEmpresaEditando(empresa)} className="text-blue-600 hover:underline">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => eliminarEmpresa(empresa.id)} className="text-red-600 hover:underline">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
