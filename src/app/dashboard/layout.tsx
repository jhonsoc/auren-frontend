/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FiBriefcase, FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import RegistrarEmpresa from './componentes/RegistrarEmpresa';
import ListaEmpresas from './componentes/ListaEmpresas';
import toast from 'react-hot-toast';

type Vista = 'dashboard' | 'registrarEmpresa' | 'consultarEmpresas';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<any>(null);
  const [vistaActiva, setVistaActiva] = useState<Vista>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('vistaActiva') as Vista) || 'dashboard';
    }
    return 'dashboard';
  });

  const [subMenuEmpresas, setSubMenuEmpresas] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (vistaActiva) {
      localStorage.setItem('vistaActiva', vistaActiva);
    }
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token no encontrado. Por favor inicia sesión.');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  // Cerrar menú si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const renderVista = () => {
    switch (vistaActiva) {
      case 'registrarEmpresa':
        return <RegistrarEmpresa />;
      case 'consultarEmpresas':
        return <ListaEmpresas />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Dashboard General</h2>
            <p>Aquí irá la visualización de estadísticas, accesos rápidos y módulos.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow text-blue-800">
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => setVistaActiva('dashboard')}
        >
          Auren+ {usuario?.empresaNombre && `| ${usuario.empresaNombre}`}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="text-sm bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            {usuario?.nombre}
          </button>
          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
              <button
                onClick={cerrarSesion}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar y contenido */}
      <div className="flex flex-1 bg-gray-50">
        <aside className="w-64 bg-white shadow-lg p-4 space-y-2">
          <div>
            <button
              onClick={() => setSubMenuEmpresas(!subMenuEmpresas)}
              className="w-full flex items-center justify-between text-blue-800 font-medium px-3 py-2 hover:bg-blue-100 rounded"
            >
              <span className="flex items-center gap-2">
                <FiBriefcase /> Empresas
              </span>
              {subMenuEmpresas ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {subMenuEmpresas && (
              <div className="ml-6 mt-1 space-y-1 text-sm text-blue-700">
                <button
                  onClick={() => setVistaActiva('registrarEmpresa')}
                  className={`block w-full text-left px-2 py-1 rounded ${vistaActiva === 'registrarEmpresa' ? 'bg-blue-100 font-semibold' : 'hover:bg-blue-50'}`}
                >
                  Registrar Empresa
                </button>
                <button
                  onClick={() => setVistaActiva('consultarEmpresas')}
                  className={`block w-full text-left px-2 py-1 rounded ${vistaActiva === 'consultarEmpresas' ? 'bg-blue-100 font-semibold' : 'hover:bg-blue-50'}`}
                >
                  Consultar Empresas
                </button>
              </div>
            )}
          </div>

          {/* USUARIOS */}
          <button className="w-full flex items-center gap-2 text-blue-800 px-3 py-2 hover:bg-blue-100 rounded">
            <FiUsers /> Usuarios
          </button>
        </aside>

        {/* Panel de contenido */}
        <main className="flex-1 overflow-y-auto">{renderVista()}</main>
      </div>
    </div>
  );
}
