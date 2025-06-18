export interface Usuario {
  id?: string;
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  rol: string;
  empresaId?: string;
}

export interface Empresa {
  id: string;
  razonSocial: string;
}

