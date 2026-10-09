'use client';

import { useActionState, useRef } from 'react';

import { setVisibility, softDeleteProduct, type ActionState } from './actions';

const initialState: ActionState = {};

type Props = { id: string; name: string; visibility: 'PUBLIC' | 'PRIVATE' };

export default function ProductRowActions({ id, name, visibility }: Props) {
  const [visState, visAction, visPending] = useActionState(setVisibility, initialState);
  const [delState, delAction, delPending] = useActionState(softDeleteProduct, initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextVisibility = visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

  return (
    <div className='flex flex-col items-end gap-1'>
      <div className='flex gap-2'>
        <form action={visAction}>
          <input type='hidden' name='id' value={id} />
          <input type='hidden' name='visibility' value={nextVisibility} />
          <button
            type='submit'
            disabled={visPending}
            className='rounded border px-3 py-1 text-sm disabled:opacity-50'
          >
            {visibility === 'PUBLIC' ? '비공개로' : '공개로'}
          </button>
        </form>
        <button
          type='button'
          onClick={() => dialogRef.current?.showModal()}
          className='rounded border border-red-300 px-3 py-1 text-sm text-red-600'
        >
          삭제
        </button>
      </div>

      {visState.error && (
        <p role='alert' className='max-w-60 text-right text-xs text-red-600'>
          {visState.error}
        </p>
      )}

      <dialog ref={dialogRef} className='m-auto rounded-lg p-6 backdrop:bg-black/40'>
        <p className='mb-1 font-bold'>{name}</p>
        <p className='mb-4 text-sm text-gray-600'>
          이 제품을 삭제할까요? 공개 화면에서 사라지고 목록에서도 숨겨집니다.
        </p>
        {delState.error && (
          <p role='alert' className='mb-3 text-sm text-red-600'>
            {delState.error}
          </p>
        )}
        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            className='rounded border px-3 py-1 text-sm'
          >
            취소
          </button>
          <form action={delAction}>
            <input type='hidden' name='id' value={id} />
            <button
              type='submit'
              disabled={delPending}
              className='rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50'
            >
              {delPending ? '삭제 중...' : '삭제'}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
