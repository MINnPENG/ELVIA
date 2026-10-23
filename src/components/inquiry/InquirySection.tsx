'use client';

import { useState } from 'react';
import InquiryForm from './InquiryForm';
import BeforeInquiryCard from './BeforeInquiryCard';
import SubmittedCard from './SubmittedCard';
import { CreatedInquiry } from '@/lib/inquiries/schema';
import InquiryFlowCard from './InquiryFlowCard';

export default function InquirySection() {
  const [submitted, setSubmitted] = useState<CreatedInquiry | null>(null);

  const handleSuccess = (inquiry: CreatedInquiry) => {
    setSubmitted(inquiry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className='flex w-full flex-col gap-4 bg-white px-6 py-14.5'>
        <p className='text-[14px] leading-5 font-bold text-[#071A33]'>고객 문의</p>
        <p className='text-[36px] leading-11.5 font-bold text-[#101828]'>
          {submitted ? '문의가 정상적으로 접수되었습니다' : '제품 사용 중 궁금한 점을 남겨주세요'}
        </p>
        <p className='text-[16px] leading-6.25 text-[#667085]'>
          작성하신 이메일과 문의 비밀번호로 답변 상태를 확인할 수 있습니다
        </p>
      </div>

      <div className='mx-6 flex flex-col-reverse gap-10 bg-white pb-18 md:flex-row md:items-start md:pt-10 lg:gap-6 lg:pt-12'>
        <div className='flex flex-1 flex-col gap-7'>
          {submitted ? (
            <div className='flex flex-col lg:flex-row lg:justify-between'>
              <SubmittedCard inquiry={submitted} />
              <div className='mt-20'>
                <InquiryFlowCard />
              </div>
            </div>
          ) : (
            <div className='flex flex-col-reverse gap-6 lg:flex-row lg:justify-between'>
              <div className='flex flex-1 flex-col gap-7'>
                <div>
                  <p className='mb-2 text-[28px] leading-9.5 font-bold text-[#101828]'>문의 정보</p>
                  <p className='text-[14px] leading-5.5 text-[#667085]'>
                    필수 항목을 정확하게 입력해 주세요. * 표시는 필수 입력입니다.
                  </p>
                </div>
                <hr className='text-[#EAECF0]' />
                <InquiryForm onSuccess={handleSuccess} />
              </div>
              <BeforeInquiryCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
