import DetailRightSection from '@/components/product/DetailRightSection';
import { getPublicProductById } from '@/lib/products/queries';
import { notFound } from 'next/navigation';

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getPublicProductById(id);

  if (!product) notFound();
  return (
    <div>
      <DetailRightSection product={product} />
    </div>
  );
}
