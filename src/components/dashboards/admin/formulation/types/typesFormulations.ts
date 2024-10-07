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
  prodAttributes: any[];
}

export interface FormulationItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Formulation {
  id: string;
  presentation: number;
  name: string;
  description: string;
  product: Product;
  formulationItems: FormulationItem[];
}

export const initialProduct: Product = {
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
};

export const initialFormulationItem: FormulationItem = {
  id: "",
  quantity: 0,
  product: initialProduct, // Utilizamos el estado inicial de Product
};

export const initialFormulation: Formulation = {
  id: "",
  presentation: 0,
  name: "",
  description: "",
  product: initialProduct, // Utilizamos el estado inicial de Product
  formulationItems: [initialFormulationItem], // Al menos un item por defecto
};
