import { contact } from '@/data/content';

export default function Footer() {
  return (
    <div className='bg-[#0E1521] px-6'>
      <div className='flex flex-col gap-4 py-18'>
        <h4 className='text-[28px] font-bold text-white'>DOOR&TECH / ELVIA</h4>
        <div className='text-[15px] leading-8 text-[#B2BFD1]'>
          <p>{contact.name}</p>
          <p>{contact.address}</p>
          <p>{contact.tel}</p>
        </div>
      </div>
    </div>
  );
}
