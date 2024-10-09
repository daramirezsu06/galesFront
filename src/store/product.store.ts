import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { Actions } from "@/utils/types/tables/actions.enum";
import { initialProd } from "@/utils/constants";
import { IProduct } from "@/utils/types/products/IProduct";

interface State {
  product: IProduct; // Cambié a no ser nullable
  action: Actions;
  fields: string[];
  setProduct: (product: IProduct) => void;
  updProduct: (name: keyof IProduct, value: any) => void;
  setAction: (action: Actions) => void;
}

export const useProductStore = create<State>()(
  persist(
    (set, get) => ({
      product: initialProd, // Asegúrate que `initialProd` tenga todos los campos definidos
      action: Actions.VIEW,
      fields: [],
      setProduct: (product: IProduct) => {
        return set((state) => ({
          ...state,
          product, // Directamente asignar el producto
          fields: [], // Reiniciar fields aquí
        }));
      },
      updProduct: (name: keyof IProduct, value: any) => {
        console.log("updProduct", name, value);
        const newFields = get().fields;
        if (!newFields.includes(name)) newFields.push(name);

        return set((state) => ({
          ...state,
          product: {
            ...state.product,
            [name]: value,
          },
          fields: newFields,
        }));
      },
      setAction: (action: Actions) => {
        console.log("SET ACTION", action);
        return set((state) => ({
          ...state,
          action,
        }));
      },
    }),
    {
      name: "product",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
