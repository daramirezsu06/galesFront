"use client";
import "react-international-phone/style.css";

import Spinner2 from "@/components/shared/Spinner2";
import useNewEditProduct from "./useNewEditProduct";
import { Actions } from "@/utils/types/tables/actions.enum";
import Image from "next/image";
import { EditIcon } from "@/icons";
import ProductTabs from "./ProductTabs";

const NewEditProduct = ({ handleChangeData }) => {
  const {
    categories,
    brands,
    product,
    loading,
    preview,
    action,
    errors,
    onSelectFile,
    handleChange,
    handleCancel,
    hadleSubmit,
    handleSelectChange,
  } = useNewEditProduct({ handleChangeData });

  return (
    <>
      <div className="text-sm">
        <button onClick={handleCancel}>Productos</button> /{" "}
        {action === Actions.NEW ? "Nuevo" : "Modificar"}
      </div>
      <form id="user-form" onSubmit={hadleSubmit} noValidate className="mt-8">
        {loading && <Spinner2 />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Verificamos si 'product' no es null antes de acceder a sus propiedades */}
          {product && (
            <>
              {/* name */}
              <div className="">
                <label className="label-form" htmlFor="name">
                  Nombre:
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input-form"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={product.name || ""}
                />
                <p
                  className={`input-error ${
                    errors.name ? "opacity-100" : "opacity-0"
                  }`}>
                  {errors.name}
                </p>
              </div>

              {/* slug */}
              <div className="">
                <label className="label-form" htmlFor="slug">
                  Slug:
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  className="input-form"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={product.slug || ""}
                />
                <p
                  className={`input-error ${
                    errors.slug ? "opacity-100" : "opacity-0"
                  }`}>
                  {errors.slug}
                </p>
              </div>

              {/* Código Descuento */}
              <div className="">
                <label className="label-form" htmlFor="discount">
                  Código Descuento:
                </label>
                <input
                  id="discount"
                  name="discount"
                  type="text"
                  className="input-form"
                  disabled
                />
                <p
                  className={`input-error ${
                    errors.slug ? "opacity-100" : "opacity-0"
                  }`}>
                  {errors.slug}
                </p>
              </div>

              {/* Brand */}
              <div className="relative">
                <label className="label-form" htmlFor="brandId">
                  Marca:
                </label>
                <div className="mt-2">
                  <select
                    id="brandId"
                    name="brandId"
                    className="input-form"
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    value={product.brandId || ""}>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 top-4 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                  <p
                    className={`input-error ${
                      errors.brandId ? "opacity-100" : "opacity-0"
                    }`}>
                    {errors.brandId}
                  </p>
                </div>
              </div>

              {/* Código */}
              <div className="">
                <label className="label-form" htmlFor="cod">
                  Código:
                </label>
                <input
                  id="cod"
                  name="cod"
                  type="text"
                  className="input-form"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={product.cod || ""}
                />
                <p
                  className={`input-error ${
                    errors.cod ? "opacity-100" : "opacity-0"
                  }`}>
                  {errors.cod}
                </p>
              </div>

              {/* Otros campos similares */}
              {/* ... */}
            </>
          )}
        </div>

        <ProductTabs />

        <div className="mt-8 col-span-2 flex justify-between">
          <button
            onClick={handleCancel}
            type="button"
            className="btn btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn btn-confirm">
            {action === Actions.NEW ? "Crear" : "Modificar"}
          </button>
        </div>
      </form>
    </>
  );
};

export default NewEditProduct;
