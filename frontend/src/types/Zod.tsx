import { object, string, number, TypeOf } from 'zod';

export const SignInSchema = object({
  email: string().email(),
  pwd: string().min(8),
});

export const SignUpSchema = object({
  email: string().email(),
  pwd: string().min(8),
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

export const TemplateSchema = object({
  topic:      string(),
  subject:    string(),
  version:    number(),
  schemaBody: object({}).passthrough(),
  format:     string(),
});

export type IFormAddress = TypeOf<typeof AddressSchema>;
export type IFormSignup = TypeOf<typeof SignUpSchema>;
export type IFormSignin = TypeOf<typeof SignInSchema>;
export type IFormTemplate = TypeOf<typeof TemplateSchema>;