export enum OrderStatus {
  BLOCKED = "blocked",
  ACTIVE = "active",
  CANCELLED = "cancelled",
  DELIVERED = "delivered",
}

export enum PaymentMethod {
  DEBITO = "debito",
  CREDITO = "credito",
  EFECTIVO = "efectivo",
  TRANSFERENCIA = "transferencia",
}

export interface OrderResponse {
  date: string; // ISO string representation of date (e.g., "2024-10-09T15:52:49.207Z")
  deliveryDate: string | null; // Puede ser una fecha en formato ISO o null
  deliveryUser: string | null; // Puede ser un string o null
  id: string; // UUID de la orden
  nroFactura: string | null; // Número de factura, puede ser null
  observation: string | null; // Observaciones, puede ser null
  paymentDate: string | null; // Fecha de pago, puede ser una fecha en formato ISO o null
  paymentMethod: PaymentMethod; // Método de pago, se asume que es un enum
  status: OrderStatus; // Estado de la orden, se asume que es un enum
  total: number; // Total de la orden
}

// Ejemplo de uso:
const exampleOrderResponse: OrderResponse = {
  date: "2024-10-09T15:52:49.207Z",
  deliveryDate: null,
  deliveryUser: null,
  id: "61a4ec21-9cc8-4b04-bb65-c9e2776eff29",
  nroFactura: null,
  observation: null,
  paymentDate: null,
  paymentMethod: PaymentMethod.EFECTIVO, // O el valor correspondiente de tu enum
  status: OrderStatus.ACTIVE, // O el valor correspondiente de tu enum
  total: 6400,
};
