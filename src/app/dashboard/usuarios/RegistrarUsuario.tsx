'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RegistrarUsuario() {
  const [formData, setFormData] = useState({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    rol: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          {[
            ['documento', 'Documento'],
            ['nombres', 'Nombres'],
            ['apellidos', 'Apellidos'],
            ['telefono', 'Teléfono'],
            ['email', 'Correo'],
            ['rol', 'Rol'],
          ].map(([name, label]) => (
            <div key={name}>
              <Label htmlFor={name} className="text-black">
                {label}
              </Label>
              <Input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="text-black placeholder-gray-400"
              />
            </div>
          ))}
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
