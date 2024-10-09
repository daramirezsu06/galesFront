"use client";
import { useShopCartStore } from "@/store/shopCart.store";
import { IProdCart } from "@/utils/types/products/IProdCart";
import { useEffect, useState } from "react";

const AddToCart = ({ product }) => {
  const [prodCart, setProdCart] = useState<IProdCart>({
    id: product.id,
    name: product.name,
    thumbnail: product.thumbnail,
    retailPrice: product.retailPrice,
    wholesalePrice: product.wholesalePrice,
    quantity: 0,
  });

  const setProducts = useShopCartStore((state) => state.setProducts);
  const products = useShopCartStore((state) => state.products);

  useEffect(() => {
    // Verifica si products no es null o undefined antes de buscar el producto
    if (products) {
      const prodInCart = products.find((el) => el.id === product.id);

      if (prodInCart) {
        setProdCart((prevState) => ({
          ...prevState,
          quantity: prodInCart.quantity,
        }));
      }
    }
  }, [product.id, products]);
  // Manejar el cambio en la cantidad
  const handleChangeQuantity = (value: number) => {
    const newQuantity = Math.max(0, value); // Asegurarse de que la cantidad no sea negativa

    setProdCart((prevState) => ({
      ...prevState,
      quantity: newQuantity,
    }));

    // Actualizar el producto en el store
    setProducts({
      ...prodCart,
      quantity: newQuantity,
    });
  };

  return (
    <div className="w-full pt-4">
      {prodCart.quantity > 0 ? (
        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleChangeQuantity(prodCart.quantity - 1)}
            type="button"
            className="btn btn-confirm">
            -
          </button>
          <input
            type="number"
            className="input-form text-center"
            value={prodCart.quantity || 0}
            onChange={(e) => handleChangeQuantity(Number(e.target.value))}
          />
          <button
            onClick={() => handleChangeQuantity(prodCart.quantity + 1)}
            type="button"
            className="btn btn-confirm">
            +
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleChangeQuantity(1)}
          className="bg-red-600 text-white p-2 rounded mx-auto block">
          Agregar al carrito
        </button>
      )}
    </div>
  );
};

export default AddToCart;
