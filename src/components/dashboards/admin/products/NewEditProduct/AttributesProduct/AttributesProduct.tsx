import CircleButton from "@/components/shared/CircleButton";
import useAttributesProduct from "./useAttributesProduct";
import { TrashIcon, PlusIcon } from "@/icons";
import { Actions } from "@/utils/types/tables/actions.enum";

const AttributesProduct = () => {
  const { attributes, product, currAttrOption, handleChangeAttrib, onNew } =
    useAttributesProduct();

  return (
    <div className="">
      <button type="button" className="ml-auto block" onClick={onNew}>
        <CircleButton className="ml4 p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
          <PlusIcon className="w-8 h-8 text-teal-700" />
        </CircleButton>
      </button>

      {/* Verificar si product y prodAttributes están definidos */}
      {product &&
      product.prodAttributes &&
      product.prodAttributes.length > 0 ? (
        product.prodAttributes.map((attrib) => (
          <div key={attrib.id} className="mt-2 flex gap-2">
            {attrib.action !== "delete" && (
              <>
                <input
                  type="text"
                  className="input-form"
                  disabled
                  name="name"
                  value={attrib.name}
                />
                <input
                  type="text"
                  className="input-form"
                  name="value"
                  value={attrib.value}
                  onChange={(e) =>
                    handleChangeAttrib(attrib.id, e.target.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className="input-form"
                  id={`unit-${attrib.attrId}`}
                  name={`unit`}
                  list={`unitDefault-${attrib.attrId}`}
                  value={attrib.unit}
                  onChange={(e) =>
                    handleChangeAttrib(attrib.id, e.target.name, e.target.value)
                  }
                />
                <datalist id={`unitDefault-${attrib.attrId}`}>
                  <option value={currAttrOption(attrib.attrId)}></option>
                </datalist>

                <div
                  onClick={() =>
                    handleChangeAttrib(attrib.id, "action", Actions.DELETE)
                  }
                  className="btn-icon">
                  <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
                    <TrashIcon className="text-red-700 w-5 h-5" />
                  </CircleButton>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No attributes available</p> // Mensaje alternativo si no hay atributos
      )}
    </div>
  );
};

export default AttributesProduct;
