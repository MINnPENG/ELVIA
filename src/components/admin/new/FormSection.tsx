import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className='grid gap-10 border-b border-[#EAECF0] py-10 md:grid-cols-[290px_1fr]'>
      <div className='flex flex-col gap-2'>
        <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>{title}</p>
        <p className='text-[14px] leading-5.5 text-[#667085]'>{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
