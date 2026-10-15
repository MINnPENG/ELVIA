import { formatFileSize } from '@/lib/inquiries/format';
import { InquiryDetail } from '@/lib/inquiries/types';

type AttachmentListProps = { files: InquiryDetail['attachments'] };

export default function AttachmentList({ files }: AttachmentListProps) {
  return (
    <div className='flex items-center gap-3 bg-[#F8FAFC] p-4'>
      <span className='shrink-0 text-[12px] leading-4.5 text-[#667085]'>첨부파일</span>
      {files.length > 0 ? (
        <ul className='flex min-w-0 flex-col items-center gap-1.5'>
          {files.map((file) => (
            <li key={file.id} className='flex gap-2 text-[14px] leading-5.5 text-[#101828]'>
              <span className='truncate'>{file.name}</span>
              <span className='shrink-0 text-[14px] leading-5.5 text-[#101828]'>
                {formatFileSize(file.size)}
              </span>
              <a
                href={file.url}
                aria-label={`${file.name} 다운로드`}
                className='shrink-0 text-[14px] leading-5.5 text-[#101828] hover:underline'
              >
                다운로드
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-[14px] leading-5.5 text-[#101828]'>없음</span>
      )}
    </div>
  );
}
