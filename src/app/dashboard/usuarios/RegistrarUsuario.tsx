'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

interface Empresa {
  id: string;
  razonSocial: string;
}

interface Usuario {
  id: string;
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  rol: string;
  empresaId?: string;
}

export default function ModalEditarUsuario({
  usuario,
  onClose,
  onActualizado,
}: {
  usuario: Usuario;
  onClose: () => void;
  onActualizado: () => void;
}) {
  const [formData, setFormData] = useState<Usuario>(usuario);
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsSuperAdmin(decoded.rol === 'superadmin');
      } catch {
        // ignore decoding errors
      }
    }

    const fetchEmpresas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setEmpresas(data);
      } catch {
        toast.error('Error al cargar empresas');
      }
    };

    fetchEmpresas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRolSelect = (rol: string) => {
    setFormData((prev) => ({
      ...prev,
      rol,
      empresaId: rol === 'admin' || rol === 'empleado' ? prev.empresaId ?? '' : '',
    }));
  };

  const handleEmpresaSelect = (empresaId: string) => {
    setFormData((prev) => ({ ...prev, empresaId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data?.id) {
        throw new Error();
      }
      toast.success('Usuario actualizado correctamente');
      onActualizado();
      onClose();
    } catch {
      toast.error('Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl max-w-3xl w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-black">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['documento', 'nombres', 'apellidos', 'telefono', 'email'] as const).map((name) => (
              <div key={name}>
                <Label htmlFor={name} className="text-black">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Label>
                <Input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  className="text-black placeholder-gray-400"
                />
              </div>
            ))}

            {/* Rol */}
            <div>
              <Label htmlFor="rol" className="text-black">
                Rol
              </Label>
              <Select onValueChange={handleRolSelect} value={formData.rol}>
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {(isSuperAdmin ? ['superadmin', 'admin', 'empleado'] : ['admin', 'empleado']).map(
                    (rol) => (
                      <SelectItem key={rol} value={rol}>
                        {rol}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Empresa */}
            {(formData.rol === 'admin' || formData.rol === 'empleado') && (
              <div>
                <Label htmlFor="empresaId" className="text-black">
                  Empresa
                </Label>
                <Select
                  onValueChange={handleEmpresaSelect}
                  value={formData.empresaId ?? ''}
                >
                  <SelectTrigger className="w-full text-black">
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
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-700 text-white hover:bg-blue-800 rounded-xl">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
