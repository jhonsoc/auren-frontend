'use client';

export default function UsuarioEmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-[#fdfdfc] min-h-screen">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios de Empresa</h1>
        <p className="text-sm text-gray-500">
          Registra, consulta y edita usuarios asociados a cada empresa.
        </p>
      </header>

      <section>{children}</section>
    </div>
  );
}
