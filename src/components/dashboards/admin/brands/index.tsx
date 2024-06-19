import getBrands from '@/utils/api/brands/getBrands';
import BrandsTable from './BrandsTable';
import NewBrand from './newBrand/NewBrand';

const Brands = async () => {
  const brands = await getBrands();
  console.log("brands", brands)
  return (
    <>
      <header className='flex justify-between items-start'>
        <h2>Marcas</h2>
        <NewBrand />
      </header>
      <BrandsTable brands={brands} />
    </>
  )
}
export default Brands;