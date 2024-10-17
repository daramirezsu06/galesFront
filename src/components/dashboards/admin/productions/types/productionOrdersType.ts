export interface Product {
  id: string;
  name: string;
  slug: string;
  cod: string;
  sku: string | null;
  cost: string;
  originalPrice: string;
  wholesalePrice: string;
  retailPrice: string;
  stock: number;
  minQuantity: number;
  maxQuantity: number;
  status: string;
  thumbnail: string;
  description: string;
  productType: string;
  categoriesIds: string[];
  prodAttributes: any[]; // Asumo que los atributos del producto pueden variar en estructura
}

export interface ProductionOrderItem {
  id: string;
  quantityUsed: number;
  cost: string | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface ProductionOrder {
  id: string;
  quantityProduced: number;
  totalCostEstimated: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  productionOrderItems: ProductionOrderItem[];
  product: Product;
}
export enum ProductionOrderStatus {
  IN_PROCESS = "IN_PROCESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}


export const productionsOrderInitialState: ProductionOrder = {
  id: "",
  quantityProduced: 0,
  totalCostEstimated: null,
  status: "",
  createdAt: "",
  updatedAt: "",
  productionOrderItems: [],
  product: {
    id: "",
    name: "",
    slug: "",
    cod: "",
    sku: null,
    cost: "0",
    originalPrice: "0",
    wholesalePrice: "0",
    retailPrice: "0",
    stock: 0,
    minQuantity: 0,
    maxQuantity: 0,
    status: "",
    thumbnail: "",
    description: "",
    productType: "",
    categoriesIds: [],
    prodAttributes: [],
  },
};
