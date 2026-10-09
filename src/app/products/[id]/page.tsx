import DetailRightSection from '@/components/product/DetailRightSection';
import { getProductById } from '@/mock/product';
import { notFound } from 'next/navigation';

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();
  return (
    <div>
      <DetailRightSection product={product} />
    </div>
  );
}
