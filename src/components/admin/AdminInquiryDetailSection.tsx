import { AdminInquiryDetail } from '@/lib/admin/inquiries';
import InquiryDetailView from '../inquiry/InquiryDetailView';
import AdminAnswerForm from './AdminAnswerForm';

interface AdminInquiryDetailSectionProps {
  selectedId?: string;
  data: AdminInquiryDetail | null;
}

export default function AdminInquiryDetailSection({
  selectedId,
  data,
}: AdminInquiryDetailSectionProps) {
  if (!selectedId || !data) {
    return (
      <div className='p-20'>
        <p className='text-[20px] text-[#667085]'>
          {selectedId ? '문의를 찾을 수 없습니다.' : '왼쪽 목록에서 문의를 선택해 주세요.'}
        </p>
      </div>
    );
  }

  return (
    <InquiryDetailView detail={data.detail} className=''>
      <AdminAnswerForm
        key={selectedId}
        inquiryId={selectedId}
        status={data.detail.status}
        submittedAnswer={data.detail.answer?.content ?? null}
        draft={data.draft}
      />
    </InquiryDetailView>
  );
}
