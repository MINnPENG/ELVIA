import { LinkButton } from '@/components/buttons/Buttons';
import AnswerField from '@/components/inputs/AnswerField';
import InquiryDetailView from '@/components/inquiry/InquiryDetailView';
import { getVerifiedInquiryDetail } from '@/lib/inquiries/session';
import { redirect } from 'next/navigation';

export default async function DetailInquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const detail = await getVerifiedInquiryDetail(id);
  if (!detail) redirect('/inquiry-list');

  return (
    <div>
      <InquiryDetailView detail={detail} className='rounded-xl border border-[#E4E7EC]'>
        <AnswerField
          label='답변'
          readOnly
          value={detail.answer?.content ?? ''}
          placeholder='아직 답변이 등록되지 않았습니다.'
        />
        <div className='flex items-center justify-end'>
          <LinkButton href='/inquiry-list' className='h-12 w-32.5 rounded-lg px-5 py-3.5 font-bold'>
            확인
          </LinkButton>
        </div>
      </InquiryDetailView>
    </div>
  );
}
