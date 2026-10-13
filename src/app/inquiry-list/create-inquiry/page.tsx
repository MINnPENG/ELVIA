import BeforeInquiryCard from '@/components/inquiry/BeforeInquiryCard';
import InquiryForm from '@/components/inquiry/InquiryForm';

export default function InquiryPage() {
  return (
    <div className='flex flex-col bg-[#F8FAFC]'>
      <div className='flex w-full flex-col gap-4 bg-white px-6 pt-14.5'>
        <p className='text-[14px] leading-5 font-bold text-[#071A33]'>고객 문의</p>
        <p className='text-[36px] leading-11.5 font-bold text-[#101828]'>
          제품 사용 중 궁금한 점을 남겨주세요
        </p>
        <p className='text-[16px] leading-6.25 text-[#667085]'>
          문의 내용을 확인한 뒤 입력하신 이메일로 답변 완료 소식을 알려드립니다.
        </p>
      </div>

      <div className='mx-6 flex flex-col-reverse gap-10 bg-white pb-18 md:flex-row md:items-start md:pt-10 lg:gap-6 lg:pt-12'>
        <div className='flex flex-1 flex-col gap-7'>
          <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>문의 정보</p>
          <p className='text-[14px] leading-5.5 text-[#667085]'>
            필수 항목을 정확하게 입력해 주세요. * 표시는 필수 입력입니다.
          </p>
          <hr className='text-[#EAECF0]' />
          <InquiryForm />
        </div>
        <div>
          <BeforeInquiryCard />
        </div>
      </div>
    </div>
  );
}
