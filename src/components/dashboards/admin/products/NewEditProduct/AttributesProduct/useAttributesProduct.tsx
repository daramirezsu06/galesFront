import { useProductStore } from "@/store/product.store";
import getAttributes from "@/utils/api/attributes/getAttributes";
import { AttributeResponse } from "@/utils/types/attributes/atributeType";
import { Actions } from "@/utils/types/tables/actions.enum";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const useAttributesProduct = () => {
  const [attributes, setAttributes] = useState<AttributeResponse[]>([]);
  const product = useProductStore((state) => state.product);
  const updProduct = useProductStore((state) => state.updProduct);

  const fetchData = async () => {
    const attributes = await getAttributes();
    setAttributes(attributes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateSelectOptions = () => {
    let select = `
    <div class='text-left'>
      <label for='attrId' class="label-form">Atributo:</label>
      <select id="attrId" class="input-form">`;

    attributes.map((option) => {
      select += `<option value="${option.id}">${option.name}</option>`;
    });

    select += `
      </select>
    </div>
    <div class='text-left mt-4' >
      <label for='value' class="label-form">Valor:</label>
      <input
        id='value'
        name="value"
        type="text"
        class="input-form"
        placeholder="Valor"
      />
    </div>
    <div class='text-left mt-4' >
      <label for='unit' class="label-form">Unidad:</label>
      <input
        id='unit'
        name="unit"
        type="text"
        class="input-form"
        placeholder="Unidad de medida"
      />
    </div>`;

    return select;
  };

  const currAttrOption = (attrib: string) => {
    const attribute = attributes.find((attr) => attr.id === attrib);
    return (attribute && attribute.unitDefault) || "";
  };

  const handleChangeAttrib = (id: string, name: string, value: string) => {
    if (!product || !product.prodAttributes) return;

    const newAttribs = product.prodAttributes.map((el) =>
      el.id === id
        ? {
            ...el,
            [name]: value,
            action: el.action === Actions.NEW ? Actions.NEW : Actions.EDIT,
          }
        : el
    );
    updProduct("prodAttributes", newAttribs);
  };

  const onNew = () => {
    if (!product) return; // Asegurarse de que product no sea nulo
    const newAttribs = [...product.prodAttributes, { id: "new-1" }];

    Swal.fire({
      title: "Nuevo atributo",
      html: generateSelectOptions(),
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      customClass: {
        actions: "swal-edit-buttons",
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        // Comprobaciones de nulidad antes de acceder a parentElement
        if (confirmButton) {
          const actionsContainer = confirmButton.parentElement;
          if (actionsContainer) {
            // Verificar que cancelButton no sea null antes de agregarlo
            if (cancelButton) {
              actionsContainer.appendChild(cancelButton);
            }
            actionsContainer.appendChild(confirmButton);
          }
        }
      },
      preConfirm: async () => {
        const elId = document.getElementById("attrId") as HTMLInputElement;
        const id = elId.value;
        const elValue = document.getElementById("value") as HTMLInputElement;
        const value = elValue.value;
        const elUnit = document.getElementById("unit") as HTMLInputElement;
        const unit = elUnit.value;

        if (!id || !value) {
          Swal.showValidationMessage("El nombre y el valor son obligatorios");
          return false;
        }

        const found = product.prodAttributes.findIndex(
          (el) => el.attrId === id && el.name !== "deleted"
        );

        if (found !== -1) {
          Swal.showValidationMessage("El atributo ya existe");
          return false;
        }

        const attribute = attributes.find((el) => el.id === id);

        Swal.showLoading();

        return new Promise(async (resolve, reject) => {
          try {
            const newAttributes = [
              ...product.prodAttributes,
              {
                id: Date.now() + " -" + Math.floor(Math.random() * 1000),
                attributeId: attribute?.id, // Manejar caso donde attribute puede ser undefined
                name: attribute?.name, // Manejar caso donde attribute puede ser undefined
                value,
                unit,
                action: Actions.NEW,
              },
            ];
            updProduct("prodAttributes", newAttributes);
            resolve(attribute);
          } catch (error) {
            reject(new Error(error));
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(), // Deshabilitar clics fuera del modal
    });
  };

  return { attributes, product, currAttrOption, handleChangeAttrib, onNew };
};

export default useAttributesProduct;
