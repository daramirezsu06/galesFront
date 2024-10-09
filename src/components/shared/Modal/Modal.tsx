import ReactDOM from "react-dom";
import { CloseSquareIcon } from "@/icons";
import styles from "./Modal.module.css";

function Modal({ children, isOpenModal, closeModal, width = "full" }) {
  const handleClickContainer = (e) => e.stopPropagation();

  // Obtén el elemento del DOM
  const modalRoot = document.getElementById("modal");

  // Si no existe el elemento 'modal', no renderices nada
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <section
      className={`${styles.modal} ${isOpenModal && styles.is_open}`}
      onClick={closeModal}>
      <div
        className={`${styles.modal_container} ${
          width === "full" ? "max-w-full" : "max-w-md"
        }`}
        onClick={handleClickContainer}>
        <button
          type="button"
          onClick={closeModal}
          className={styles.modal_close}>
          <CloseSquareIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
    </section>,
    modalRoot // Pasa modalRoot que ya fue verificado
  );
}

export { Modal };
