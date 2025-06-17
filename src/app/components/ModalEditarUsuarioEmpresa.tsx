'use client';

import { useState } from 'react';
import { UsuarioEmpresaForm } from './UsuarioEmpresaForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  usuario: any;
  onClose: () => void;
  onActualizado: () => void;
  empresas: { id: string; razonSocial: string }[];
}

export default function ModalEditarUsuarioEmpresa({ usuario, onClose, onActualizado, empresas }: Props) {
  const [formData, setFormData] = useState({ ...usuario });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmpresaSelect = (empresaId: string) => {
    setFormData(prev => ({ ...prev, empresaId }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario-empresa/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success('Usuario actualizado');
      onActualizado();
      onClose();
    } catch {
      toast.error('Error al actualizar usuario');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-black">Editar Usuario</DialogTitle>
        </DialogHeader>
        <UsuarioEmpresaForm
          formData={formData}
          onChange={handleChange}
          empresas={empresas}
          onEmpresaSelect={handleEmpresaSelect}
          isEdit
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
