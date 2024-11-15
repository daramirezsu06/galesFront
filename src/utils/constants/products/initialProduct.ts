import { ProductStatus } from '@/utils/types/products/productStatus.enun';

export const initialProd = {
  id: '',
  name: '',
  slug: '',
  brandId: '',
  prodAttributes: [],
  cod: '',
  description: '',
  originalPrice: 0,
  categoriesIds: [],
  retailPrice: 0,
  sku: '',
  status: ProductStatus.ACTIVE,
  stock: 0,
  maxQuantity: 0,
  minQuantity: 0,
  thumbnail: '',
  wholesalePrice: 0,
  images: [],
  productType: '',
}