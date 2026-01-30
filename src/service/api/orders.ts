import { api } from "@/lib/axios";

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export async function fetchOrders(): Promise<Order[]> {
  const response = await api.get("/orders");
  return response.data;
}
