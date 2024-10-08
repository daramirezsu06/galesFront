import CircleButton from "@/components/shared/CircleButton";
import { EditIcon, PlusIcon, TrashIcon } from "@/icons";
import newAttribute from "@/utils/api/attributes/newAttribute";
import removeAttribute from "@/utils/api/attributes/removeAttibute";
import updAttribute from "@/utils/api/attributes/updAttribute";
import { AttributeResponse } from "@/utils/types/attributes/atributeType";
import { Actions } from "@/utils/types/tables/actions.enum";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const initAttribute = {
  id: "",
  name: "",
  unitDefault: "",
};

const useAttributes = ({ allAtributes }) => {
  const [attributes, setAttributes] = useState<AttributeResponse[]>([]);
  const [currentData, setCurrentData] = useState(initAttribute);
  const [action, setAction] = useState(Actions.VIEW);

  useEffect(() => {
    setAttributes(allAtributes);
  }, [allAtributes]);

  useEffect(() => {
    if (action === Actions.NEW || action === Actions.EDIT) {
      handleNewEdit();
    }
    if (action === Actions.DELETE) {
      handleDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const handleCancel = () => {
    setAction(Actions.VIEW);
    setCurrentData(initAttribute);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Unidad",
      selector: (row) => row.unitDefault,
      sortable: true,
      hide: 768,
    },
    {
      name: "Acciones",
      width: "15%",
      hide: 768,
      cell: (row) => (
        <div className="flex gap-4">
          <div onClick={() => onDelete(row)} className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <TrashIcon className="text-red-700 w-6 h-6" />
            </CircleButton>
          </div>
          <div onClick={() => onEdit(row)} className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <EditIcon className="text-blue-700 w-6 h-6" />
            </CircleButton>
          </div>
        </div>
      ),
    },
  ];

  const handleNewEdit = () => {
    Swal.fire({
      title: `Modificar atributo ${currentData.name}`,
      html: `
        <div class='text-left'>
            <label for='name' class="label-form">Nombre:</label>
            <input
              id='name'
              name="name"
              value="${currentData.name}"
              type="text"
              class="input-form"
              placeholder="Nombre"
            />
          </div>
          <div class='text-left mt-4'>
            <label for='unit' class="label-form">Unidad:</label>
            <input
              id='unit'
              name="unit"
              type="text"
              class="input-form"
              placeholder="Unidad de medida"
              value="${currentData.unitDefault}"
            />
          </div>
          `,
      showCancelButton: true,
      confirmButtonText: action === Actions.NEW ? "Crear" : "Modificar",
      cancelButtonText: "Cancelar",
      customClass: {
        actions: "swal-edit-buttons",
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        // Check if the buttons exist before attempting to access parentElement
        if (confirmButton && cancelButton) {
          const actionsContainer = confirmButton.parentElement;
          if (actionsContainer) {
            actionsContainer.appendChild(cancelButton);
            actionsContainer.appendChild(confirmButton);
          }
        }
      },
      preConfirm: async () => {
        const elName = document.getElementById("name") as HTMLInputElement;
        const name = elName.value;
        const elUnit = document.getElementById("unit") as HTMLInputElement;
        const unitDefault = elUnit.value;

        if (!name) {
          Swal.showValidationMessage("El nombre es obligatorio");
          return false;
        }

        Swal.showLoading();

        return new Promise(async (resolve, reject) => {
          try {
            let attribute;
            if (action === Actions.NEW) {
              attribute = await newAttribute({ name, unitDefault });
            } else {
              attribute = await updAttribute(currentData.id, {
                name,
                unitDefault,
              });
            }
            resolve(attribute);
          } catch (error) {
            reject(new Error(error));
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(), // Deshabilitar clics fuera del modal
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Atributo modificado",
            icon: "success",
          });
          handleRefresh(result.value);
        }
        if (result.isDismissed) handleCancel();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message, // Mostrar mensaje de error
          icon: "error",
        });
      });
  };

  const onNew = () => {
    setCurrentData(initAttribute);
    setAction(Actions.NEW);
  };

  const onEdit = (row) => {
    setCurrentData({
      id: row.id,
      name: row.name,
      unitDefault: row.unitDefault,
    });
    setAction(Actions.EDIT);
  };

  const onDelete = (row) => {
    setCurrentData(row);
    setAction(Actions.DELETE);
    // if (row.productCount > 0) {
    //   Swal.fire({
    //     title: 'Error',
    //     text: "La marca posee productos",
    //     icon: 'error'
    //   });
    //   handleCancel()
    //   return
    // }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Eliminar atributo",
      text: "¿Estás seguro de eliminar el atributo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        actions: "swal-delete-buttons",
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        // Check if the buttons exist before attempting to access parentElement
        if (confirmButton && cancelButton) {
          const actionsContainer = confirmButton.parentElement;
          if (actionsContainer) {
            actionsContainer.appendChild(cancelButton);
            actionsContainer.appendChild(confirmButton);
          }
        }
      },
      preConfirm: async () => {
        Swal.showLoading();
        return new Promise((resolve, reject) => {
          try {
            removeAttribute(currentData.id).then(resolve).catch(reject);
          } catch (error) {
            reject(new Error(error));
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading(), // Deshabilitar clics fuera del modal
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Atributo eliminado",
            icon: "success",
          });
          handleRefresh(result.value);
        }
        if (result.isDismissed) handleCancel();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error.message, // Mostrar mensaje de error
          icon: "error",
        });
      });
  };

  const actionsMenu = useMemo(() => {
    return (
      <button onClick={onNew}>
        <CircleButton className="ml4 p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
          <PlusIcon className="w-8 h-8 text-teal-700" />
        </CircleButton>
      </button>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = (value) => {
    console.log("handleRefresh", action, value);

    switch (action) {
      case Actions.NEW:
        setAttributes([...attributes, { ...value, productCount: 0 }]);
        break;
      case Actions.EDIT:
        const newValue = attributes.map((attribute) =>
          attribute.id === value.id ? { ...value } : attribute
        );
        setAttributes(newValue);
        break;
      case Actions.DELETE:
        const newAttributes = attributes.filter(
          (attribute) => attribute.id !== value.id
        );
        setAttributes(newAttributes);
        break;
    }

    setAction(Actions.VIEW);
    setCurrentData(initAttribute);
  };

  return {
    attributes,
    currentData,
    columns,
    actionsMenu,
    action,
    handleCancel,
  };
};

export default useAttributes;
