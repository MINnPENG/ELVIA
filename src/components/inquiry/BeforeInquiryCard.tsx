export default function BeforeInquiryCard() {
  return (
    <div className='flex flex-col gap-6 border border-[#EAECF0] bg-[#FDFEFF] p-8 shadow-[0_2px_8px_0_rgba(10,26,51,0.08)]'>
      <p className='text-[20px] leading-7 font-bold text-[#101828]'>문의 전 확인해주세요</p>
      <p className='text-[14px] leading-5.5 text-[#667085]'>
        제품 모델명과 증상을 자세히 적어주시면 더 정확한 안내가 가능합니다.
      </p>
      <div className='flex flex-col gap-4.5 rounded-xl bg-[#F8FAFC] p-5 text-[14px] leading-5.5 text-[#101828]'>
        <div className='flex flex-col'>
          <p>고객센터</p>
          <p>070-4745-4034</p>
        </div>
        <div className='flex flex-col'>
          <p>운영시간</p>
          <p>평일 09:00-18:00</p>
        </div>
        <div className='flex flex-col'>
          <p>답변 안내</p>
          <p>등록한 이메일로 완료 알림</p>
        </div>
      </div>
      <p className='mb-51 text-[12px] leading-4.5 text-[#667085]'>
        문의 비밀번호는 암호화되어 저장되며, 문의 확인에만 사용됩니다.
      </p>
    </div>
  );
}
