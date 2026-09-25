export type Plan = {
  name: string;
  code: "free" | "basic" | "max";
  price: number;
  conversations: number;
  notifications: number;
  featured?: boolean;
};

export type Expense = {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: "Gasto" | "Reintegro";
};

export type PersonalEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  recurrence: string;
  active: boolean;
};

export const plans: Plan[] = [
  {
    name: "Gratuito",
    code: "free",
    price: 0,
    conversations: 60,
    notifications: 15,
  },
  {
    name: "Básico",
    code: "basic",
    price: 5000,
    conversations: 480,
    notifications: 60,
    featured: true,
  },
  {
    name: "Max",
    code: "max",
    price: 15000,
    conversations: 1920,
    notifications: 240,
  },
];

export function getPlan(code: string): Plan {
  return plans.find((plan) => plan.code === code) ?? plans[0];
}

export const initialExpenses: Expense[] = [
  {
    id: "exp-1",
    description: "Supermercado",
    category: "Compras",
    date: "22 sep",
    amount: 48250,
    type: "Gasto",
  },
  {
    id: "exp-2",
    description: "Internet",
    category: "Servicios esenciales",
    date: "20 sep",
    amount: 21500,
    type: "Gasto",
  },
  {
    id: "exp-3",
    description: "Reintegro farmacia",
    category: "Otros",
    date: "18 sep",
    amount: 8300,
    type: "Reintegro",
  },
  {
    id: "exp-4",
    description: "Cena con amigos",
    category: "Salidas",
    date: "16 sep",
    amount: 32700,
    type: "Gasto",
  },
];

export const initialEvents: PersonalEvent[] = [
  {
    id: "event-1",
    title: "Pagar alquiler",
    description: "Transferir antes del mediodía",
    date: "01 oct",
    time: "09:00",
    recurrence: "Mensual",
    active: true,
  },
  {
    id: "event-2",
    title: "Turno con el dentista",
    description: "Consultorio de Palermo",
    date: "03 oct",
    time: "16:30",
    recurrence: "No se repite",
    active: true,
  },
  {
    id: "event-3",
    title: "Revisar gastos de la semana",
    description: "Mirar el resumen y ajustar presupuesto",
    date: "06 oct",
    time: "18:00",
    recurrence: "Semanal",
    active: true,
  },
];
