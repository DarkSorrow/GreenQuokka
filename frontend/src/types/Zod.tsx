import { array, number, object, record, string, boolean, date, union, TypeOf } from 'zod';

const formHelper = object({
  language: string().optional(),
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