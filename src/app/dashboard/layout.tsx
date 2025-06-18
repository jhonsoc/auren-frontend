'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FiBriefcase, FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import RegistrarEmpresa from './componentes/RegistrarEmpresa';
import ListaEmpresas from './componentes/ListaEmpresas';



interface DecodedToken {
    nombre?: string;
    empresaNombre?: string;
    rol?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<DecodedToken | null>(null);
    const [subMenuEmpresas, setSubMenuEmpresas] = useState(false);
    const [subMenuUsuarios, setSubMenuUsuarios] = useState(false);
    const [vistaActiva, setVistaActiva] = useState<'inicio' | 'registrarEmpresa' | 'listarEmpresas'>('inicio');
    const [openMenu, setOpenMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token no encontrado. Por favor inicia sesión.');
            setTimeout(() => router.push('/login'), 100);
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            setUsuario(decoded);
        } catch {
            toast.error('Token inválido. Redirigiendo...');
            localStorage.removeItem('token');
            setTimeout(() => router.push('/login'), 100);
        }
    }, [router]);

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

    const mostrarRutasUsuarios = pathname.startsWith('/dashboard/usuarios') || pathname.startsWith('/dashboard/usuario-empresa');

    useEffect(() => {
        if (pathname.startsWith('/dashboard/usuarios') || pathname.startsWith('/dashboard/usuario-empresa')) {
            setSubMenuUsuarios(true);
            setSubMenuEmpresas(false);
        } else if (pathname.startsWith('/dashboard')) {
            // If navigating to company section
            if (vistaActiva !== 'inicio') setSubMenuEmpresas(true);
        }
    }, [pathname, vistaActiva]);

    const toggleEmpresas = () => {
        setSubMenuEmpresas((prev) => !prev);
        if (!subMenuEmpresas) setSubMenuUsuarios(false);
    };

    const toggleUsuarios = () => {
        setSubMenuUsuarios((prev) => !prev);
        if (!subMenuUsuarios) setSubMenuEmpresas(false);
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white px-6 py-4 flex justify-between items-center shadow text-blue-800">
                <div
                    className="font-bold text-xl cursor-pointer"
                    onClick={() => router.push('/dashboard')}
                >
                    Auren+ {usuario?.empresaNombre && `| ${usuario.empresaNombre}`}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="text-sm bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                    >
                        {usuario?.nombre ?? 'Usuario'}
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

            {/* Sidebar + contenido */}
            <div className="flex flex-1 bg-gray-50">
                <aside className="w-64 bg-white shadow-lg p-4 space-y-2">
                    {/* Empresas */}
                    <div>
                        <button
                            onClick={toggleEmpresas}
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
                                    onClick={() => {
                                        setVistaActiva('registrarEmpresa');
                                        setSubMenuUsuarios(false);
                                    }}
                                    className={`block w-full text-left px-2 py-1 rounded ${vistaActiva === 'registrarEmpresa' ? 'bg-blue-100 font-semibold' : 'hover:bg-blue-50'
                                        }`}
                                >
                                    Registrar Empresa
                                </button>

                                <button
                                    onClick={() => {
                                        setVistaActiva('listarEmpresas');
                                        setSubMenuUsuarios(false);
                                    }}
                                    className={`block w-full text-left px-2 py-1 rounded ${vistaActiva === 'listarEmpresas'
                                        ? 'bg-blue-100 font-semibold'
                                        : 'hover:bg-blue-50'
                                        }`}
                                >
                                    Consultar Empresas
                                </button>

                            </div>
                        )}
                    </div>

                    {/* Usuarios */}
                    <div>
                        <button
                            onClick={toggleUsuarios}
                            className="w-full flex items-center justify-between text-blue-800 font-medium px-3 py-2 hover:bg-blue-100 rounded"
                        >
                            <span className="flex items-center gap-2">
                                <FiUsers /> Usuarios
                            </span>
                            {subMenuUsuarios ? <FiChevronUp /> : <FiChevronDown />}
                        </button>

                        {subMenuUsuarios && (
                            <div className="ml-6 mt-1 space-y-1 text-sm text-blue-700">
                                <button
                                    onClick={() => {
                                        setVistaActiva('inicio');
                                        router.push('/dashboard/usuarios/registrar');
                                    }}
                                    className={`block w-full text-left px-2 py-1 rounded ${pathname === '/dashboard/usuarios/registrar' ? 'bg-blue-100 font-semibold' : 'hover:bg-blue-50'}`}
                                >
                                    Registrar Usuario
                                </button>
                                <button
                                    onClick={() => {
                                        setVistaActiva('inicio');
                                        router.push('/dashboard/usuarios');
                                    }}
                                    className={`block w-full text-left px-2 py-1 rounded ${pathname === '/dashboard/usuarios' ? 'bg-blue-100 font-semibold' : 'hover:bg-blue-50'}`}
                                >
                                    Consultar Usuarios
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-4">
                    {mostrarRutasUsuarios ? (
                        children
                    ) : (
                        <>
                            {vistaActiva === 'registrarEmpresa' && <RegistrarEmpresa />}
                            {vistaActiva === 'listarEmpresas' && <ListaEmpresas />}
                            {vistaActiva === 'inicio' && (
                                <div className="space-y-4">
                                    <h1 className="text-2xl font-bold">Dashboard General</h1>
                                    <p className="text-gray-600">Aquí irá la visualización de estadísticas, accesos rápidos y módulos.</p>
                                </div>
                            )}
                        </>
                    )}
                </main>

            </div>
        </div>
    );
}
