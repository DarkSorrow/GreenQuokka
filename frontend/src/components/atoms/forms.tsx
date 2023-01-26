import { FormHTMLAttributes, PropsWithChildren } from 'react'
import { FormProvider, SubmitHandler, useForm, UseFormProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/fields'

export type FormContainerProps<T extends FieldValues> = PropsWithChildren<UseFormProps<T> & {
  onSuccess: SubmitHandler<T>
  FormProps?: FormHTMLAttributes<HTMLFormElement>
}>

export const Form = <TFieldValues extends FieldValues = FieldValues>({
  children,
  FormProps,
  onSuccess,
  ...useFormProps }: PropsWithChildren<FormContainerProps<TFieldValues>>) => {
  const methods = useForm<TFieldValues>({
    ...useFormProps
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSuccess)} autoComplete="off" noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
