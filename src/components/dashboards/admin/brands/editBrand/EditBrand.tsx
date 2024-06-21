"use client";

import CircleButton from '@/components/shared/CircleButton'
import EditIcon from '@/icons/edit'
import useEditBrand from './useEditBrand';

const EditBranch = ({ brand }) => {
  const { handleEdit } = useEditBrand({ brand });
  return (
    <button onClick={handleEdit}>
      <CircleButton className='p-2 rounded-full cursor-pointer hover:bg-purple-950/20'>
        <EditIcon className='w-6 h-6 text-blue-700' />
      </CircleButton>
    </button>
  )
}
export default EditBranch