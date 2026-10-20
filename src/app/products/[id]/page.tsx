import DetailRightSection from '@/components/product/DetailRightSection';
import ImageSection from '@/components/product/ImageSection';
import ProductCard from '@/components/product/ProductCard';
import { getCategoryConfig } from '@/lib/products/categories';
import { formatPrice } from '@/lib/products/labels';
import { getPublicProductById, getPublicProducts } from '@/lib/products/queries';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) return { title: '제품을 찾을 수 없습니다 | ELVIA' };

  return {
    title: `${product.name} | ELVIA`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.thumbnailUrl ? [product.thumbnailUrl] : undefined,
    },
  };
}

export default async function DetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) notFound();

  // 제품이 있을 때만 추천 제품을 조회한다.
  const featured = await getPublicProducts({ featuredOnly: true });
  const category = getCategoryConfig(product.category);

  return (
    <div>
      <div className='px-7 pt-7'>
        <p className='text-[14px] text-[#616B7A]'>
          홈 / 제품 소개 / {category.label} / {product.name}
        </p>
      </div>
      <div className='grid items-center gap-6 px-7 py-16 lg:grid-cols-2'>
        <ImageSection product={product} />
        <DetailRightSection product={product} />
      </div>
      <div className='flex flex-col gap-7 pb-10'>
        <div className='flex items-center justify-between px-7 py-8 lg:py-4'>
          <h3 className='text-[19px] font-bold md:text-[22px] lg:text-[30px]'>함께 살펴볼 제품</h3>
          <div className='flex items-center gap-1 text-[#1F61C7] hover:cursor-pointer'>
            <Link href='/products' className='text-[15px]'>
              전체보기
            </Link>
            <Plus size={14} />
          </div>
        </div>
        <div className='flex flex-wrap justify-center gap-6 px-6'>
          {featured
            .filter((item) => item.id !== product.id)
            .map((product) => (
              <ProductCard
                id={product.id}
                key={product.id}
                image={product.thumbnailUrl}
                name={product.name}
                priceLabel={formatPrice(product)}
                description={product.shortDescription}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
