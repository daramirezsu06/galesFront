import "react-international-phone/style.css";
import Spinner2 from "@/components/shared/Spinner2";
import { useEffect, useState } from "react";
import postNewFormulation from "@/utils/api/formulations/postFormulation";

const NewFormulation = ({
  loading,
  errors,
  action,
  handleCancel,
  productsList,
}) => {
  // Estado inicial para la nueva formulación
  const [newFormulation, setNewFormulation] = useState({
    productId: "",
    name: "",
    description: "",
    presentation: 1,
    formulationItems: [
      {
        productId: "",
        quantity: 0,
      },
    ],
  });
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    try {
      await postNewFormulation(newFormulation);
      alert("Formulación creada con éxito");
    } catch (error) {
      console.error("Error al crear la formulación:", error);
      alert(error);
    }
  };


  // Función para manejar cambios en la nueva formulación
  const handleChangeNew = (index, name, value) => {
    // Si estás modificando el objeto principal fuera de formulationItems
    if (index === null) {
      setNewFormulation({
        ...newFormulation,
        [name]: name == "presentation" ? Number(value) : value,
      });
    } else {
      // Si estás modificando un item dentro de formulationItems
      const updatedItems = [...newFormulation.formulationItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: name == "quantity" ? Number(value) : value,
      };

      setNewFormulation({
        ...newFormulation,
        formulationItems: updatedItems,
      });
    }
  };

  // Función para agregar un nuevo objeto en formulationItems
  const addNewItem = () => {
    setNewFormulation({
      ...newFormulation,
      formulationItems: [
        ...newFormulation.formulationItems,
        {
          productId: "",
          quantity: 0,
        },
      ],
    });
  };
  useEffect(() => {
    console.log(newFormulation);
  }, [newFormulation]);

  return (
    <>
      <div className="text-sm">
        <button onClick={handleCancel}>formulations</button> /{" "}
        {action === "NEW" ? "Nuevo" : "Modificar"}
      </div>
      <form id="user-form" onSubmit={handleSubmit} noValidate className="mt-8">
        {loading && <Spinner2 />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Selección de producto */}
          <div>
            <label className="label-form">producto a producir:</label>

            <select
              id="new-product-select"
              name="productId"
              className="input-form"
              onChange={(e) =>
                handleChangeNew(null, e.target.name, e.target.value)
              }
              value={newFormulation.productId}>
              {productsList
                .filter(
                  (product) =>
                    product.productType === "PT" || product.productType === "PI"
                )
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Nombre completo */}
          <div className="">
            <label className="label-form">Nombre completo:</label>
            <input
              name="name"
              type="text"
              className="input-form"
              onChange={(e) =>
                handleChangeNew(null, e.target.name, e.target.value)
              }
              value={newFormulation.name}
            />
            <p
              className={`input-error ${
                errors.name ? "opacity-100" : "opacity-0"
              }`}>
              {errors.name}
            </p>
          </div>

          {/* Presentación */}
          <div className="">
            <label className="label-form">Presentación (unidades o kg):</label>
            <input
              name="presentation"
              type="text"
              className="input-form"
              onChange={(e) =>
                handleChangeNew(null, e.target.name, e.target.value)
              }
              value={newFormulation.presentation}
            />
            <p
              className={`input-error ${
                errors.presentation ? "opacity-100" : "opacity-0"
              }`}>
              {errors.presentation}
            </p>
          </div>

          {/* Descripción */}
          <div className="">
            <label className="label-form">Descripción:</label>
            <input
              name="description"
              type="text"
              className="input-form"
              onChange={(e) =>
                handleChangeNew(null, e.target.name, e.target.value)
              }
              value={newFormulation.description}
            />
          </div>

          {/* Items de la fórmula */}
          <div className="col-span-2">
            <h1>Items de la fórmula</h1>
            {newFormulation.formulationItems.map((item, index) => (
              <div key={index} className="flex gap-2 my-2">
                <select
                  id={`product-${index}`}
                  name="productId"
                  className="input-form"
                  onChange={(e) =>
                    handleChangeNew(index, e.target.name, e.target.value)
                  }
                  value={item.productId}>
                  {productsList.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  name="quantity"
                  type="text"
                  placeholder="Cantidad"
                  className="input-form"
                  onChange={(e) =>
                    handleChangeNew(index, e.target.name, e.target.value)
                  }
                  value={item.quantity || ""}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addNewItem}
              className="btn btn-confirm mt-4">
              Añadir nuevo item
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className="col-span-2 flex justify-between">
          <button
            onClick={handleCancel}
            type="button"
            className="btn btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn btn-confirm">
            crear
          </button>
        </div>
      </form>
    </>
  );
};

export default NewFormulation;
