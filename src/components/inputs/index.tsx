'use client';

import { forwardRef, type Ref } from 'react';
import TextField, { type TextFieldProps } from './TextField';
import TextareaField, { type TextareaFieldProps } from './StringField';
import SelectField, { type SelectFieldProps } from './SelecField';
import FileField, { type FileFieldProps } from './FileField';
import { REQUIRED_MESSAGE, Validator } from './validation';

export type { SelectOption } from './SelecField';
export { REQUIRED_MESSAGE, type Validator } from './validation';

export type InputProps = TextFieldProps | TextareaFieldProps | SelectFieldProps | FileFieldProps;
type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement;

const Input = forwardRef<InputElement, InputProps>((props, ref) => {
  switch (props.type) {
    case 'textarea':
      return <TextareaField {...props} ref={ref as Ref<HTMLTextAreaElement>} />;
    case 'select':
      return <SelectField {...props} ref={ref as Ref<HTMLButtonElement>} />;
    case 'file':
      return <FileField {...props} ref={ref as Ref<HTMLInputElement>} />;
    default:
      return <TextField {...props} ref={ref as Ref<HTMLInputElement>} />;
  }
});

Input.displayName = 'Input';

export default Input;
