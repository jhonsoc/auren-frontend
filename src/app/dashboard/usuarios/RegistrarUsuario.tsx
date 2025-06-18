'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { jwtDecode } from 'jwt-decode';
import type { Usuario, Empresa } from '@/types';
import { toast } from 'sonner';

  const [formData, setFormData] = useState<Usuario>({
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
        const decoded = jwtDecode<{ rol?: string }>(token);
}

interface FormData {
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  rol: string;
  empresaId: string;
}

export default function RegistrarUsuario() {
  const [formData, setFormData] = useState<FormData>({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    rol: '',
    empresaId: '',
  });

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
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      empresaId: rol === 'admin' || rol === 'empleado' ? prev.empresaId : '',
    }));
  };

  const handleEmpresaSelect = (empresaId: string) => {
    setFormData((prev) => ({ ...prev, empresaId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
        method: 'POST',
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
      toast.success('Usuario registrado exitosamente');
    } catch {
      toast.error('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#fdfdfc] rounded-xl shadow-sm max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-black">Registrar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['documento', 'nombres', 'apellidos', 'telefono', 'email'].map((name) => (
            <div key={name}>
              <Label htmlFor={name} className="text-black">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Label>
              <Input
                name={name}
                value={formData[name as keyof FormData]}
                onChange={handleChange}
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                className="text-black placeholder-gray-400"
              />
            </div>
          ))}

          {/* Rol */}
          <div>
            <Label htmlFor="rol" className="text-black">Rol</Label>
            <Select onValueChange={handleRolSelect} value={formData.rol}>
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {(isSuperAdmin ? ['superadmin', 'admin', 'empleado'] : ['admin', 'empleado']).map((rol) => (
                  <SelectItem key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Empresa (solo admin o empleado) */}
          {(formData.rol === 'admin' || formData.rol === 'empleado') && (
            <div>
              <Label htmlFor="empresaId" className="text-black">Empresa</Label>
              <Select onValueChange={handleEmpresaSelect} value={formData.empresaId}>
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

        <div className="text-right">
          <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl">
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
