import { getAdminProducts } from '@/lib/admin/products';
import { requireAdmin } from '@/lib/auth/require-admin';
import { formatPrice } from '@/lib/products/labels';

import ProductRowActions from './ProductRowActions';

const CATEGORY_LABELS = { DOOR_LOCK: '도어록', ACCESSORY: '악세사리' } as const;

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProducts();

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>제품 관리</h1>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-176 text-left text-sm'>
          <thead className='border-b text-gray-500'>
            <tr>
              <th className='py-2 pr-4'>순서</th>
              <th className='py-2 pr-4'>모델명</th>
              <th className='py-2 pr-4'>분류</th>
              <th className='py-2 pr-4'>가격</th>
              <th className='py-2 pr-4'>이미지</th>
              <th className='py-2 pr-4'>상태</th>
              <th className='py-2 text-right'>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className='border-b align-top'>
                <td className='py-3 pr-4'>{p.sort_order}</td>
                <td className='py-3 pr-4 font-bold'>{p.model_name}</td>
                <td className='py-3 pr-4'>{CATEGORY_LABELS[p.category]}</td>
                <td className='py-3 pr-4'>
                  {formatPrice({
                    price: p.price_amount,
                    priceDisplayStatus: p.price_display_status,
                  }) ?? '-'}
                </td>
                <td className='py-3 pr-4'>{p.product_images.length}장</td>
                <td className='py-3 pr-4'>
                  <span
                    className={
                      p.visibility === 'PUBLIC'
                        ? 'rounded-full bg-green-100 px-2 py-0.5 text-green-700'
                        : 'rounded-full bg-gray-100 px-2 py-0.5 text-gray-600'
                    }
                  >
                    {p.visibility === 'PUBLIC' ? '공개' : '비공개'}
                  </span>
                </td>
                <td className='py-3 text-right'>
                  <ProductRowActions id={p.id} name={p.model_name} visibility={p.visibility} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className='py-8 text-center text-gray-500'>등록된 제품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
