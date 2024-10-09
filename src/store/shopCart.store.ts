import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { IProdCart } from "@/utils/types/products/IProdCart";

interface State {
  userId: string | null;
  products: IProdCart[] | null; // Permitir que sea null
  setProducts: (product: IProdCart | null) => void; // Permitir null en setProducts
  removeProducts: () => void;
  setUserId: (userId: string) => void;
}

export const useShopCartStore = create<State>()(
  persist(
    (set, get) => ({
      userId: null,
      products: [], // Inicializar como array vacío para evitar errores
      removeProducts: () => set(() => ({ products: [] })),

      setProducts: (product: IProdCart | null) => {
        if (!product) {
          return set(() => ({ products: [] })); // Si es null, vaciar el carrito
        }

        set((state) => {
          const currentProducts = state.products ?? []; // Si es null, lo convertimos en array vacío

          const index = currentProducts.findIndex(
            (item) => item.id === product.id
          );

          if (index === -1) {
            return { products: [...currentProducts, product] };
          }

          if (product.quantity === 0) {
            const updatedProducts = currentProducts.filter(
              (prod) => prod.id !== product.id
            );
            return { products: updatedProducts };
          }

          const updatedProducts = currentProducts.map((prod) =>
            prod.id === product.id
              ? { ...prod, quantity: product.quantity }
              : prod
          );
          return { products: updatedProducts };
        });
      },

      setUserId: (userId: string) => set({ userId }),
    }),
    {
      name: "shopCart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
