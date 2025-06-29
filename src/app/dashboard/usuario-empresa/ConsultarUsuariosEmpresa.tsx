'use client';

import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import ModalEditarUsuarioEmpresa from '../../components/ModalEditarUsuarioEmpresa';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import type { Usuario, Empresa } from '@/types';

export default function ConsultarUsuariosEmpresa() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>('');
  const [filtro, setFiltro] = useState('');
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario-empresa/empresa/${empresaSeleccionada}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setUsuarios(data);
    } catch {
      toast.error('Error al cargar usuarios');
    }
  }, [empresaSeleccionada]);
  useEffect(() => {
    if (empresaSeleccionada) fetchUsuarios();
  }, [empresaSeleccionada, fetchUsuarios]);

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setEmpresas(data);
    } catch {
      toast.error('Error al cargar empresas');
    }
  };


  const eliminarUsuario = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario-empresa/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error();
      toast.success('Usuario eliminado');
      fetchUsuarios();
    } catch {
      toast.error('Error al eliminar usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombres.toLowerCase().includes(filtro.toLowerCase()) ||
    u.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
    u.documento.includes(filtro)
  );

  return (
    <div className="p-6 bg-[#fdfdfc] rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-black">Usuarios por Empresa</h2>

      <div className="mb-4 flex flex-col md:flex-row items-start gap-4">
        <Select onValueChange={(value) => setEmpresaSeleccionada(value)}>
          <SelectTrigger className="w-[250px] text-black placeholder:text-gray-400">
            <SelectValue placeholder="Seleccionar empresa" />
          </SelectTrigger>
          <SelectContent>
            {empresas.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.razonSocial}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Buscar usuario por nombre, documento o apellido"
          className="md:w-96 placeholder:text-gray-400 text-black"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Documento</th>
              <th className="px-4 py-2 text-left">Nombre Completo</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 group transition">
                <td className="px-4 py-2">{u.documento}</td>
                <td className="px-4 py-2">{u.nombres} {u.apellidos}</td>
                <td className="px-4 py-2">{u.telefono}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.rol}</td>
                <td className="px-4 py-2 opacity-0 group-hover:opacity-100 transition space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setUsuarioEditando(u)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => u.id && eliminarUsuario(u.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {usuarioEditando && (
        <ModalEditarUsuarioEmpresa
          usuario={usuarioEditando}
          onClose={() => setUsuarioEditando(null)}
          onActualizado={fetchUsuarios}
          empresas={empresas}
        />
      )}
    </div>
  );
}
