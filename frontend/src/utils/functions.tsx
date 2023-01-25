import { useEffect } from 'react';


export const useScrollUp = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
//await new Promise(resolve => setTimeout(resolve, 2000));
/*const registerSchema = object({
  email: string().email('Email is invalid'),
  password: string()
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().nonempty('Please confirm your password'),
  terms: literal(true, {
    invalid_type_error: 'Accept Terms is required',
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});*/
export const onError = (error: any) => {
  console.error(error);
}
