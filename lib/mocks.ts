export type Service = {
  id: number
  name: string
  duration: number
  price?: number
  status?: 'activo' | 'inactivo'
  description?: string
}

export type Appointment = {
  id: number
  clientName: string
  serviceName: string
  date: string
  time: string
  duration: string
  location: string
  status: 'confirmada' | 'pendiente' | 'cancelada'
  notes?: string
}

export type UserRow = {
  id: number
  name: string
  email: string
  role?: string
  status: 'activo' | 'pendiente' | 'desactivado'
}

export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Consulta General',
    duration: 30,
    price: 50,
    status: 'activo',
    description: 'Primera consulta completa con evaluación inicial',
  },
  {
    id: 2,
    name: 'Seguimiento',
    duration: 20,
    price: 35,
    status: 'activo',
    description: 'Consulta de seguimiento para pacientes existentes',
  },
  {
    id: 3,
    name: 'Diagnóstico',
    duration: 45,
    price: 75,
    status: 'activo',
    description: 'Evaluación y diagnóstico detallado',
  },
  {
    id: 4,
    name: 'Consulta Virtual',
    duration: 25,
    price: 40,
    status: 'inactivo',
    description: 'Consulta por videoconferencia',
  },
]

export const mockAdminAppointments: Appointment[] = [
  {
    id: 1,
    clientName: 'María García',
    serviceName: 'Consulta General',
    date: '2024-12-20',
    time: '10:00 AM',
    duration: '30 min',
    location: 'Consultorio 1',
    status: 'confirmada',
    notes: 'Primera consulta, revisar historial médico',
  },
  {
    id: 2,
    clientName: 'Carlos López',
    serviceName: 'Seguimiento',
    date: '2024-12-20',
    time: '11:30 AM',
    duration: '20 min',
    location: 'Consultorio 2',
    status: 'pendiente',
  },
  {
    id: 3,
    clientName: 'Ana Martínez',
    serviceName: 'Diagnóstico',
    date: '2024-12-20',
    time: '02:00 PM',
    duration: '45 min',
    location: 'Sala de Diagnóstico',
    status: 'confirmada',
  },
  {
    id: 4,
    clientName: 'Pedro Sánchez',
    serviceName: 'Consulta General',
    date: '2024-12-21',
    time: '09:00 AM',
    duration: '30 min',
    location: 'Consultorio 1',
    status: 'pendiente',
  },
]

export const mockUserAppointments = [
  {
    id: 1,
    date: '2024-12-20',
    time: '10:00 AM',
    service: 'Consulta General',
    status: 'confirmada' as const,
  },
  {
    id: 2,
    date: '2024-12-27',
    time: '02:00 PM',
    service: 'Seguimiento',
    status: 'pendiente' as const,
  },
  {
    id: 3,
    date: '2024-12-15',
    time: '11:30 AM',
    service: 'Diagnóstico',
    status: 'cancelada' as const,
  },
]

export const mockClients: UserRow[] = [
  {
    id: 1,
    name: 'María García',
    email: 'maria@example.com',
    status: 'activo',
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos@example.com',
    status: 'activo',
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana@example.com',
    status: 'activo',
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    email: 'pedro@example.com',
    status: 'pendiente',
  },
  {
    id: 5,
    name: 'Laura Fernández',
    email: 'laura@example.com',
    status: 'activo',
  },
]

export const mockTimeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
]
