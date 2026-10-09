export default function BeforeInquiryCard() {
  return (
    <div className='flex flex-col gap-6 bg-[#071A33] p-8'>
      <p className='text-[28px] leading-9.5 font-bold text-white'>문의 전 확인해주세요</p>
      <p className='text-[16px] leading-6.5 text-white'>
        제품 모델명과 증상을 자세히 적어주시면
        <br />더 정확한 안내가 가능합니다.
      </p>

      <hr className='border-t border-white' />

      <div className='flex flex-col'>
        <p className='text-[12px] leading-4.5 text-white'>고객센터</p>
        <p className='text-[16px] leading-6.5 text-white'>070-4745-4034</p>
      </div>
      <div className='flex flex-col'>
        <p className='text-[12px] leading-4.5 text-white'>운영시간</p>
        <p className='text-[16px] leading-6.5 text-white'>평일 09:00-18:00</p>
      </div>
      <div className='flex flex-col'>
        <p className='text-[12px] leading-4.5 text-white'>답변 안내</p>
        <p className='text-[16px] leading-6.5 text-white'>등록한 이메일로 완료 알림</p>
      </div>
      <p className='mb-15 text-[12px] leading-4.5 text-white'>
        문의 비밀번호는 암호화되어 저장되며, 문의 확인에만 사용됩니다.
      </p>
    </div>
  );
}
