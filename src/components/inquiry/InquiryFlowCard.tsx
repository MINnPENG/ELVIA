export default function InquiryFlowCard() {
  return (
    <div className='flex flex-col border-b border-l border-[#EAECF0]'>
      <div className='flex flex-col gap-1.5 p-6'>
        <p className='text-[12px] leading-4.5 text-[#0B2447]'>01</p>
        <p className='text-[20px] leading-6.5 font-bold text-[#101828]'>문의 접수</p>
        <p className='text-[14px] leading-5.5 text-[#667085]'>
          작성 내용이 안전하게 등록되었습니다.
        </p>
      </div>
      <div className='flex flex-col gap-1.5 border-t border-b border-[#EAECF0] p-6'>
        <p className='text-[12px] leading-4.5 text-[#0B2447]'>02</p>
        <p className='text-[20px] leading-6.5 font-bold text-[#101828]'>담당자 확인</p>
        <p className='text-[14px] leading-5.5 text-[#667085]'>제품 담당자가 내용을 확인합니다.</p>
      </div>
      <div className='flex flex-col gap-1.5 p-6'>
        <p className='text-[12px] leading-4.5 text-[#0B2447]'>03</p>
        <p className='text-[20px] leading-6.5 font-bold text-[#101828]'>이메일 안내</p>
        <p className='text-[14px] leading-5.5 text-[#667085]'>
          답변 완료 시 이메일로 알려드립니다.
        </p>
      </div>
    </div>
  );
}
