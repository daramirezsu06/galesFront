import { useModal } from "@/hooks/useModal";
import { useProductStore } from "@/store/product.store";
import { Actions } from "@/utils/types/tables/actions.enum";

const useImagesProduct = () => {
  const [isOpenModalUp, openModalUp, closeModalUp] = useModal(false);

  const product = useProductStore((state) => state.product);
  const updProduct = useProductStore((state) => state.updProduct);

  const onNew = () => {
    openModalUp();
  };

  const handleDelete = (id) => {
    if (product && product.images) {
      const newAttribs = product.images.map((el) =>
        el.id === id ? { ...el, action: Actions.DELETE } : el
      );
      updProduct("images", newAttribs);
    }
  };

  return { product, onNew, isOpenModalUp, closeModalUp, handleDelete };
};
export default useImagesProduct;
