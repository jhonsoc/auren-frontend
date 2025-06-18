'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Usuario {
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  rol: string;
}

interface Props {
  formData: Usuario;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UsuarioForm({ formData, onChange }: Props) {
  const campos: [keyof Usuario, string][] = [
    ['documento', 'Documento'],
    ['nombres', 'Nombres'],
    ['apellidos', 'Apellidos'],
    ['telefono', 'Teléfono'],
    ['email', 'Correo'],
    ['rol', 'Rol'],
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {campos.map(([name, label]) => (
        <div key={name}>
          <Label htmlFor={name} className="text-black">
            {label}
          </Label>
          <Input
            name={name}
            id={name}
            placeholder={label}
            value={formData[name]}
            onChange={onChange}
            className="text-black placeholder:text-gray-400 rounded-xl"
          />
        </div>
      ))}
    </div>
  );
}
