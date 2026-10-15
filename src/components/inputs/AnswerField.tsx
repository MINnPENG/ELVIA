import { cn } from '@/utils/cn';
import Input from '.';
import { TextareaFieldProps } from './StringField';

type AnswerFieldProps = Omit<TextareaFieldProps, 'type' | 'label'> & { label?: string };

export default function AnswerField({
  label = '관리자 답변',
  readOnly,
  required,
  className,
  ...props
}: AnswerFieldProps) {
  return (
    <Input
      type='textarea'
      label={label}
      readOnly={readOnly}
      required={readOnly ? false : required}
      className={cn('resize-none hover:cursor-not-allowed', readOnly && '', className)}
      {...props}
    />
  );
}
