//import { v1 } from '@types/uuid';

export interface Openi18nOption {
  open: boolean;
  i18nMessage: string;
  i18nObject?: any;
}

export interface EntityGroup {
  DisplayName: string;
  Preferences: Record<string, string>;
  Groups: string[];
}

export interface EntitiesGroup {
  [key: string] : EntityGroup;
}

export interface ImageLogoJSON {
  // Image url
  i: string[];
  // light languages with the index found infront, usefull if there is more than one image, default is always 0
  ll: Record<string, string>;
  // dark languages with index, default will always be second then light if no second exist
  dl: Record<string, string>;
  // version of map that is being used
  v: string;
}

export interface LegalEntity {
	shards: string;
	shardsList: string[];
  name: string;
  logoJSON: ImageLogoJSON;
	email: string;
	phone: string;
	phoneCountry: string;
	country: string;
	city: string;
	postalCode: string;
	region: string;
	streetAddress: string;
	additionalAddress: string;
  legal: Record<string, string>;
	extras: Record<string, string>;
	updatedAt: Date;
	updatedBy: string;
}

export interface AddressInterface {
  country: string;
  postalCode: string;
  streetAddress: string;
  additionalAddress: string;
  region: string;
  city: string;
  [index: string]: string;
}

export interface Base {
  novaType: string;
}

export interface GeoCode {
  longitude: number;
  latitude: number;
}

export interface GeoCodeMap {
  id: string | null;
  name: string;
  map: GeoCode[];
}

export interface Person {
  id: string | null;
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  additionalEmail?: string;
  additionalPhone?: string;
}

export interface GeographicArea {
  id: string | null;
  containsPlace?: AddressInterface[];
  containsGeo?: string[];
}

export interface PointOfSale {
  organisationID: string;
  /**
   * key: GeographicAreaID
   * values: List of Person ID
   */
  contacts?: Record<string, string[]>;
}

export interface Organisation {
  id: string | null;
  legalName: string;
  logoURL?: string;
  location: AddressInterface;
  /**
   * An organization identifier that uniquely identifies a legal entity as defined in ISO 17442.
   */
  leiCode?: string;
  globalLocationNumber?: string;
  /**
   * International Standard of Industrial Classification - Revision 4 code
   */
  isicV4?: string;
  /**
   * organization identifier as defined in ISO 6523(-1)
   * ISO 6523 identifier by setting the ICD part of the ISO 6523 identifier accordingly
   */
  iso6523Code?: string;

  /**
   * Organisation ID
   */
  parentOrganisation?: string;
  /**
   * Organisation ID
   */
  subOrganisation?: string[];
}


// https://schema.org/Product
export interface ProductORG {
  id: string | null;
  gtin?: string;

  name: string;
  description?: string;
  imageURL?: string;

  model? :string;
  manufacturer?: Organisation;
  countryOfOrigin?: string;
  productionDate?: Date;
  inProductGroupWithID?: string;

  isAccessoryOrSparePartFor?: string[];
  isConsumableFor?: string[];
}

export interface Template {
  topic:      string;
  subject:    string;
  version:    number;
  schema_body: any;
  schema_rights: any;
  contracts: string;
  format:     string;
	updatedBy?: string;
	updatedAt?: Date;
  createdAt?: Date;
}

export enum PrivacyRule {
  Confidential = 0, // Access highly restricted, allowed only with zero knowledge actions
  Internal = 1, // Access restricted to the company usage only (have the main contract of the company)
  Restricted = 2, // Access restricted to people owning a special nft sold by the company
}

export interface PrivacySchema {
  fields: Record<string, PrivacyRule>;
  modified: Date;
}

export enum ContractType {
  STORAGE = 0,
  COMPUTE = 1,
  ACCESS = 2,
}

export interface ContractData {
  dataUsed: string[];
  formula: Record<string,string>;
  name: string;
  type: ContractType;
  contract: string;
  isError: boolean;
  errors: string[];
  price: number;
  share: number;
  qty: number;
  currency: string;
}

interface MinersPagination {
  total: number;
  offset: number;
  limit: number;
}

interface MinerScores {
  total: number;
  offset: number;
  limit: number;
}

interface MinerStorage {
  total: number;
  offset: number;
  limit: number;
}

interface Miner {
  storage: MinerStorage;
  scores: MinerScores;
}

export interface MinersData {
  pagination: MinersPagination;
  miners: Miner[];
}
