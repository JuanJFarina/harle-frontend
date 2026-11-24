export type Plan = {
  name: string;
  code: "free" | "basic" | "max";
  price: number;
  conversations: number;
  notifications: number;
  featured?: boolean;
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
