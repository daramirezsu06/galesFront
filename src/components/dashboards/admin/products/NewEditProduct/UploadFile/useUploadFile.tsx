import { useState } from "react";
import uploadFiles from "@/utils/api/files/uploadFiles";
import { useProductStore } from "@/store/product.store";
import { Actions } from "@/utils/types/tables/actions.enum";

const useUploadFile = ({ handleCancel }: { handleCancel: () => void }) => {
  const [images, setImages] = useState<(string | ArrayBuffer | null)[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const product = useProductStore((state) => state.product);
  const updproduct = useProductStore((state) => state.updProduct);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const handleUpload = async () => {
    if (images.length > 0) {
      const formData = new FormData();

      console.log("Images", images);

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      setLoading(true);
      try {
        const response = await uploadFiles(formData);
        setLoading(false);

        console.log("Response", response);

        const newImages = response.map((image: any) => ({
          action: Actions.NEW,
          id: image.asset_id,
          secureUrl: image.secure_url,
        }));

        if (product) {
          updproduct("images", [...product.images, ...newImages]);
        } else {
          console.warn("Product is null, unable to update images.");
        }
        handleCancel();
      } catch (error) {
        console.error("Error uploading files:", error);
        setLoading(false);
      }
    }
  };

  return { images, loading, handleDrop, handleFileSelect, handleUpload };
};

export default useUploadFile;
