import { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function UsuariosMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname.includes('/dashboard/usuario-empresa'));

  const linkStyle = (route: string) =>
    `pl-8 py-1 block rounded text-sm ${
      pathname === route ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-black hover:text-blue-600'
    }`;

  return (
    <div>
      <button
        className="flex items-center w-full text-left text-blue-700 font-medium py-2 px-4 hover:bg-blue-50 rounded"
        onClick={() => setOpen(!open)}
      >
        <Users className="w-5 h-5 mr-2" />
        Usuarios
        {open ? <ChevronDown className="ml-auto w-4 h-4" /> : <ChevronRight className="ml-auto w-4 h-4" />}
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-1">
          <Link href="/dashboard/usuario-empresa/RegistrarUsuarioEmpresa" className={linkStyle('/dashboard/usuario-empresa/RegistrarUsuarioEmpresa')}>
            Registrar Usuario
          </Link>
          <Link href="/dashboard/usuario-empresa" className={linkStyle('/dashboard/usuario-empresa')}>
            Consultar Usuarios
          </Link>
        </div>
      )}
    </div>
  );
}
