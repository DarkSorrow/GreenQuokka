import { array, object, record, string, union, TypeOf } from 'zod';

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

const ImageJSONSchema = object({
  i: array(string().regex(/^https/, 'URLSecure').url('URLFormat')),
  ll: record(string(), string()),
  dl: record(string(), string()),
  v: string(),
});

const lexicalEditor = union([string(), object({}).passthrough().transform((val) => JSON.stringify(val))]);

export type IFormAddress = TypeOf<typeof AddressSchema>;
export type IFormSignup = TypeOf<typeof SignUpSchema>;
export type IFormSignin = TypeOf<typeof SignInSchema>;