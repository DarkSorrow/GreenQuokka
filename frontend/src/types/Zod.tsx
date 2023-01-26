import { object, string, TypeOf } from 'zod';

export const SignInSchema = object({
  email: string().email(),
  password: string().min(8),
});

export const SignUpSchema = object({
  email: string().email(),
  password: string(),
  country: string().optional(),
});

const AddressSchema = object({
  id: string().optional(),
  country: string().min(2, 'Country'),
  postalCode: string(),
  streetAddress: string(),
  additionalAddress: string(),
  region: string(),
  city: string(),
  type: string().optional(),
  name: string().optional(),
});

export type IFormAddress = TypeOf<typeof AddressSchema>;
export type IFormSignup = TypeOf<typeof SignUpSchema>;
export type IFormSignin = TypeOf<typeof SignInSchema>;