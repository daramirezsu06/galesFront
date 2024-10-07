interface Product {
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
  prodAttributes: any[];
}

interface ProductionItem {
  id: string;
  quantityUsed: number;
  cost: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Production {
  id: string;
  quantityProduced: number;
  totalCost: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  productionItems: ProductionItem[];
  product: Product;
}
