import { ProductCatalog } from '@/components/product/ProductCatalog';
import { categoryFromSlug } from '@/lib/products/categories';
import { getPublicProducts } from '@/lib/products/queries';

interface ProductPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function DoorLockPage({ searchParams }: ProductPageProps) {
  const { category } = await searchParams;

  const [doorLocks, accessories] = await Promise.all([
    getPublicProducts({ category: 'DOOR_LOCK' }),
    getPublicProducts({ category: 'ACCESSORY' }),
  ]);

  return (
    <ProductCatalog
      productsByCategory={{ DOOR_LOCK: doorLocks, ACCESSORY: accessories }}
      initialCategory={categoryFromSlug(category)}
    />
  );
}
