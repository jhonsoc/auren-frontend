'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RegistrarUsuarioEmpresa() {
  const [formData, setFormData] = useState({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    rol: '',
    empresaId: '',
  });

  const [empresas, setEmpresas] = useState<{ id: string; razonSocial: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setEmpresas(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario-empresa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data?.id) {
        throw new Error('Error en la creación');
      }

      toast.success('Usuario registrado exitosamente');
    } catch (err) {
      toast.error('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#fdfdfc] rounded-xl shadow-sm max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-black">Registrar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Selección de empresa */}
        <div>
          <Label htmlFor="empresa" className="text-black mb-1 block">Empresa</Label>
          <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, empresaId: value }))}>
            <SelectTrigger className="w-full text-black">
              <SelectValue placeholder="Seleccione una empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.razonSocial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="documento" className="text-black">Documento</Label>
            <Input
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Documento"
              className="text-black placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="nombres" className="text-black">Nombres</Label>
            <Input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Nombres"
              className="text-black placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="apellidos" className="text-black">Apellidos</Label>
            <Input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Apellidos"
              className="text-black placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="telefono" className="text-black">Teléfono</Label>
            <Input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="text-black placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-black">Correo</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="text-black placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="rol" className="text-black">Rol</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, rol: value }))}>
              <SelectTrigger className="w-full text-black">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="empleado">Empleado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botón de enviar */}
        <div className="text-right">
          <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl">
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
