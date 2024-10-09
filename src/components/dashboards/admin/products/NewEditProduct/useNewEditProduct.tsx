/* eslint-disable react-hooks/exhaustive-deps */
import { fields } from "@/components/forms/constants/constants";
import { validatefield, validateForm } from "@/components/forms/validateForm";

import { createSlug } from "@/helpers/createSlug";
import { useProductStore } from "@/store/product.store";
import getBrands from "@/utils/api/brands/getBrands";
import getCategories from "@/utils/api/categories/getCategories";
import uploadFile from "@/utils/api/files/uploadFile";
import createProductAttribute from "@/utils/api/productAttribute/createProductAttribute";
import removeProductAttribute from "@/utils/api/productAttribute/removeProductAttibute";
import updProductAttribute from "@/utils/api/productAttribute/updProductAttribute";
import createProductimage from "@/utils/api/productImage/createProductImage";
import removeProductImage from "@/utils/api/productImage/removeProductImage";
import createProduct from "@/utils/api/products/createProduct";
import updateProduct from "@/utils/api/products/updateProduct";
import { initialProd } from "@/utils/constants";
import { IBrand } from "@/utils/types/brands/IBrand";
import { IProduct } from "@/utils/types/products/IProduct";
import { Actions } from "@/utils/types/tables/actions.enum";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

const useNewEditProduct = ({ handleChangeData }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string | undefined>("");

  const product = useProductStore((state) => state.product);
  const action = useProductStore((state) => state.action);
  const updProduct = useProductStore((state) => state.updProduct);
  const setProduct = useProductStore((state) => state.setProduct);
  const setAction = useProductStore((state) => state.setAction);
  const fields = useProductStore((state) => state.fields);

  const state = useProductStore((state) => state);

  const fetchData = async () => {
    const categories = await getCategories();
    setCategories(categories);
    const brands = await getBrands();
    setBrands(brands);
    if (action === Actions.NEW) {
      const brand = brands.find((el: IBrand) =>
        el.name.toLowerCase().includes("gales")
      );
      updProduct("brandId", brand.id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (name, value) => {
    // const error = validatefield(name, value);
    // setErrors({
    //   ...errors,
    //   [name]: error,
    // });

    updProduct(name, value);
    if (name === "name") {
      const slug = createSlug(value);
      updProduct("slug", slug);
    }
  };

  const handleSelectChange = (name, event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    updProduct(name, selectedValues);
  };

  const handleCancel = () => {
    setProduct(initialProd);
    setAction(Actions.VIEW);
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const hadleSubmit = async (e) => {
    e.preventDefault();

    // const errors = validateForm(product, 'userForm');

    // const valuesFormError = Object.values(errors);
    // if (valuesFormError.some((el) => el !== null)) {
    //   setErrors(errors)
    //   return;
    // }

    try {
      setLoading(true);

      // Verifica que product no sea null antes de desestructurarlo
      if (!product) {
        throw new Error("No product available"); // Manejo de errores, puedes lanzar un error o manejarlo como prefieras
      }

      const { id, prodAttributes, images, ...data } = product;
      data.originalPrice = +data.originalPrice;
      data.wholesalePrice = +data.wholesalePrice;
      data.retailPrice = +data.retailPrice;
      data.minQuantity = +data.minQuantity;
      data.maxQuantity = +data.maxQuantity;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const { secure_url } = await uploadFile(formData);
        updProduct("thumbnail", secure_url);
        data.thumbnail = secure_url;
      }
      if (!data.thumbnail) delete data.thumbnail;

      console.log("DATA", data);
      let prod;
      if (action === Actions.NEW) {
        data.stock = 0;
        prod = await createProduct(data);
        setLoading(false);
        handleChangeData(prod);
      } else {
        const updFields = fields.reduce((acc, prop) => {
          if (data.hasOwnProperty(prop)) {
            acc[prop] = data[prop];
          }
          return acc;
        }, {});

        prod = await updateProduct(id, updFields);
        setLoading(false);

        handleChangeData(prod);
      }

      // Attributes
      for (const attrib of prodAttributes) {
        if (attrib.action === Actions.NEW) {
          await createProductAttribute({
            productId: prod.id,
            attributeId: attrib.attributeId,
            value: attrib.value,
            unit: attrib.unit,
          });
        }
        if (attrib.action === Actions.DELETE) {
          await removeProductAttribute(attrib.id);
        }
        if (attrib.action === Actions.EDIT) {
          await updProductAttribute(attrib.id, {
            value: attrib.value,
            unit: attrib.unit,
          });
        }
      }

      // Images
      for (const image of images) {
        if (image.action === Actions.NEW) {
          await createProductimage({
            productId: prod.id,
            secureUrl: image.secureUrl,
          });
        }
        if (image.action === Actions.DELETE) {
          await removeProductImage(image.id);
        }
      }

      await Swal.fire({
        icon: "success",
        title: `Producto ${
          action === Actions.NEW ? "creado" : "modificado"
        } con éxito`,
        showConfirmButton: false,
        width: "450px",
        timer: 1500,
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message, // Muestra el mensaje de error
      });
    }
  };

  return {
    categories,
    brands,
    product,
    errors,
    action,
    loading,
    preview,
    onSelectFile,
    handleSelectChange,
    handleChange,
    handleCancel,
    hadleSubmit,
  };
};
export default useNewEditProduct;
