import { ProductCatalog } from '@/components/product/ProductCatalog';
import { getPublicProducts } from '@/lib/products/queries';

export default async function DoorLockPage() {
  const products = await getPublicProducts({ category: 'DOOR_LOCK' });

  return <ProductCatalog categoryLabel='도어록' products={products} perPage={8} />;
}
