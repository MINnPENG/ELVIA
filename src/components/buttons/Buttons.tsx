import Link from 'next/link';
import { ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'brand' | 'surface';
type ButtonBorder = 'none' | 'gray' | 'red';

type ButtonStyleProps = {
  variant?: ButtonVariant;
  border?: ButtonBorder;
};

const BASE = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap',
  'cursor-pointer transition-all duration-75 active:scale-[0.99]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200/40 focus-visible:ring-offset-1',
].join(' ');

const DISABLED =
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[#E4E7EC] disabled:text-[#98A2B3] disabled:active:scale-100';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-[#0E2447] text-[#FFFFFF] hover:opacity-90',
  brand: 'bg-[#071A33] text-[#FFFFFF] hover:opacity-90',
  surface: 'bg-[#FFFFFF] text-[#0F131A] hover:bg-gray-100',
};

const BORDER: Record<ButtonBorder, string> = {
  none: '',
  gray: 'border border-[#DDE3EC]',
  red: 'border border-[#FECDCA]',
};

const DEFAULT_BORDER: Record<ButtonVariant, ButtonBorder> = {
  primary: 'none',
  brand: 'none',
  surface: 'gray',
};

export function buttonClass({
  variant = 'primary',
  border,
  className,
}: ButtonStyleProps & { className?: string }) {
  return [BASE, DISABLED, VARIANT[variant], BORDER[border ?? DEFAULT_BORDER[variant]], className]
    .filter(Boolean)
    .join(' ');
}

export function LinkButton({
  variant,
  border,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClass({ variant, border, className })} {...props} />;
}

type NativeButtonProps = Omit<ComponentProps<'button'>, 'type'> & ButtonStyleProps;

export function ActionButton({ variant, border, className, ...props }: NativeButtonProps) {
  return (
    <button type='button' className={buttonClass({ variant, border, className })} {...props} />
  );
}

export function SubmitButton({ variant, border, className, ...props }: NativeButtonProps) {
  return (
    <button type='submit' className={buttonClass({ variant, border, className })} {...props} />
  );
}

export function DownloadButton({
  variant = 'surface',
  border,
  className,
  href,
  fileName,
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'download'> &
  ButtonStyleProps & {
    href: string;
    fileName?: string;
  }) {
  return (
    <a
      href={href}
      download={fileName ?? true}
      className={buttonClass({ variant, border, className })}
      {...props}
    />
  );
}
