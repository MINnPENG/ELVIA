'use client';

import { InquiryStatus } from '@/lib/inquiries/types';
import { saveAnswerDraft, submitAnswer } from '@/mock/answer';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import AnswerField from '../inputs/AnswerField';
import { ActionButton } from '../buttons/Buttons';

const HINT_EDITABLE = '답변 등록 후 문의 상태가 완료로 변경되고 작성 이메일로 알림이 발송됩니다.';
const HINT_LOCKED = '등록된 답변은 수정할 수 없습니다.';

type AdminAnswerFormProps = {
  inquiryId: string;
  status: InquiryStatus;
  submittedAnswer: string | null;
  draft: string | null;
};

type ConfirmKind = 'draft' | 'submit';
type Message = { tone: 'ok' | 'error'; text: string };

export default function AdminAnswerForm({
  inquiryId,
  status,
  submittedAnswer,
  draft,
}: AdminAnswerFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(draft ?? '');
  const [lockedAnswer, setLockedAnswer] = useState<string | null>(submittedAnswer);
  const [message, setMessage] = useState<Message | null>(null);
  const [isPending, startTransition] = useTransition();

  const locked = status === 'COMPLETED' || lockedAnswer !== null;
  const empty = value.trim() === '';

  function run(kind: ConfirmKind) {
    setMessage(null);

    startTransition(async () => {
      const action = kind === 'draft' ? saveAnswerDraft : submitAnswer;
      const result = await action({ inquiryId, content: value });

      if (!result.ok) {
        setMessage({ tone: 'error', text: result.error });

        if (kind === 'submit') router.refresh();

        return;
      }

      if (kind === 'draft') {
        setMessage({ tone: 'ok', text: '임시 저장되었습니다.' });

        return;
      }

      setLockedAnswer(value.trim());
      setMessage(
        result.mailSent
          ? { tone: 'ok', text: '답변이 등록되었습니다.' }
          : { tone: 'error', text: '답변은 등록되었지만 알림 메일 발송에 실패했습니다.' }
      );
      router.refresh();
    });
  }

  return (
    <div>
      {locked ? (
        <AnswerField readOnly value={lockedAnswer ?? submittedAnswer ?? ''} hint={HINT_LOCKED} />
      ) : (
        <AnswerField
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isPending}
          placeholder='고객에게 전달할 답변을 입력해 주세요.'
          hint={HINT_EDITABLE}
        />
      )}

      {message && (
        <p className='text-[14px] leading-5.5' role='status'>
          {message.text}
        </p>
      )}

      {!locked && (
        <div className='mt-6 flex items-center justify-end gap-2.5'>
          <ActionButton
            variant='surface'
            disabled={empty || isPending}
            onClick={() => run('draft')}
            className='h-12 w-32.5 rounded-lg px-5 py-3.5 font-bold'
          >
            임시 저장
          </ActionButton>
          <ActionButton
            className='h-12 w-32.5 rounded-lg px-5 py-3.5 font-bold'
            disabled={empty || isPending}
            onClick={() => run('submit')}
          >
            {isPending ? '처리 중...' : '답변 등록'}
          </ActionButton>
        </div>
      )}
    </div>
  );
}
