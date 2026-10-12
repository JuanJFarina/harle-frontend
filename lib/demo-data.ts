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
