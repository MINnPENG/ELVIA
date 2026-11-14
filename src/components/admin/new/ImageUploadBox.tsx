'use client';

import { ActionButton } from '@/components/buttons/Buttons';
import { ProductImage } from '@/lib/admin/types';
import Image from 'next/image';
import { ChangeEvent, DragEvent, useRef } from 'react';

const SLOTS = ['대표 이미지', '이미지 2', '이미지 3', '이미지 4', '이미지 5'];
interface ImageUploadBoxProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  onError?: (message: string) => void;
}
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUploadBox({ value, onChange, onError }: ImageUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: File[]) => {
    if (files.length === 0) return;

    const room = 5 - value.length;
    if (files.length > room) {
      return onError?.(
        room === 0
          ? '이미지는 최대 5장까지 등록할 수 있습니다.'
          : `이미지는 최대 5장까지 등록할 수 있습니다. ${room}장 이하로 선택해 주세요.`
      );
    }

    const valid = files.filter((file) => ACCEPT_TYPES.includes(file.type));
    if (valid.length < files.length) onError?.('JPG, PNG, WebP 파일만 등록할 수 있습니다.');

    const added: ProductImage[] = valid.slice(0, room).map((file) => ({
      kind: 'new',
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    if (added.length > 0) onChange([...value, ...added]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemove = (id: string) => {
    const target = value.find((img) => img.id === id);
    if (target?.kind === 'new') URL.revokeObjectURL(target.previewUrl);
    onChange(value.filter((img) => img.id !== id));
  };

  return (
    <div className='flex flex-col gap-5'>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className='flex flex-col items-center gap-2 border border-dashed border-[#D0D5DD] bg-[#F8FAFC] p-6 text-center'
      >
        <p className='text-[16px] leading-6.5 text-[#101828]'>
          이미지를 끌어다 놓거나 파일을 선택하세요
        </p>
        <p className='text-[12px] leading-4.5 text-[#667085]'>
          JPG / PNG / WebP · 최소 1장, 최대 5장 · 권장 비율 4:5
        </p>
        <input
          ref={inputRef}
          type='file'
          accept={ACCEPT_TYPES.join(',')}
          multiple
          hidden
          onChange={handleChange}
        />
        <ActionButton
          variant='surface'
          className='h-12 rounded-sm px-5 py-3.5 text-[14px] leading-5 font-bold text-[#0B2447]'
          onClick={() => inputRef.current?.click()}
          disabled={value.length >= 5}
        >
          파일 선택
        </ActionButton>
      </div>

      <div className='grid grid-cols-5 gap-3'>
        {SLOTS.map((slot, i) => {
          const image = value[i];
          return (
            <div
              key={slot}
              className={
                'relative flex aspect-5.5/5 items-center justify-center overflow-hidden border text-[12px] leading-4.5 text-[#667085] ' +
                (i === 0 ? 'border-[#D0D5DD] bg-[#F8FAFC]' : 'border-[#EAECF0] bg-white')
              }
            >
              {image ? (
                <>
                  <Image
                    src={image.kind === 'new' ? image.previewUrl : image.url}
                    alt={slot}
                    fill
                    unoptimized
                    sizes='20vw'
                    className='object-contain'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemove(image.id)}
                    aria-label={`${slot} 삭제`}
                    className='absolute top-1.5 right-1.5 cursor-pointer rounded bg-white/90 px-1.5 py-0.5 text-[11px] text-[#667085] hover:text-[#101828]'
                  >
                    삭제
                  </button>
                </>
              ) : (
                slot
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
