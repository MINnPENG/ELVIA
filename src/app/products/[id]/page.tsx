import DetailRightSection from '@/components/product/DetailRightSection';
import ImageSection from '@/components/product/ImageSection';
import { getProductById, getProducts } from '@/mock/product';
import { notFound } from 'next/navigation';

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // const product = getProductById(id);
  const product = getProducts().find((p) => p.name === 'ER-10N');
  if (!product) return null;

  if (!product) notFound();
  return (
    <div className='grid gap-6 px-6 py-16 lg:grid-cols-2'>
      <ImageSection product={product} />
      <DetailRightSection product={product} />
    </div>
  );
}
