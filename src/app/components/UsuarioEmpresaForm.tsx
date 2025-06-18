'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Usuario, Empresa } from '@/types';

interface Props {
  formData: Usuario;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  empresas: Empresa[];
  onEmpresaSelect: (empresaId: string) => void;
}

export function UsuarioEmpresaForm({ formData, onChange, empresas, onEmpresaSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="empresaId" className="text-black">Empresa</Label>
        <Select onValueChange={onEmpresaSelect} defaultValue={formData.empresaId}>
          <SelectTrigger className="text-black placeholder:text-gray-400">
            <SelectValue placeholder="Seleccionar empresa" />
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

      {(
        [
          ['documento', 'Documento'],
          ['nombres', 'Nombres'],
          ['apellidos', 'Apellidos'],
          ['telefono', 'Teléfono'],
          ['email', 'Email'],
          ['rol', 'Rol (admin o empleado)'],
        ] as [keyof Usuario, string][]
      ).map(([name, label]) => (
        <div key={name}>
          <Label htmlFor={name} className="text-black">{label}</Label>
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
