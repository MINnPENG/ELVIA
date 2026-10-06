import { ProductCatalog } from '@/components/product/ProductCatalog';
import { products } from '@/data/product';

export default function DoorLockPage() {
  const doorlockProducts = products.filter((p) => p.category === 'doorlock');

  return <ProductCatalog categoryLabel='도어록' products={doorlockProducts} perPage={8} />;
}
