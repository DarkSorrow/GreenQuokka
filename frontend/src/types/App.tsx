export interface OptionType {
  id: string;
  l: string;
}

export interface LegalFormsProps {
  suffix: string;
}

export class NVError extends Error {
  i18nLabel?: string;
}

export enum RequestStatus {
  Init = 0,
  Loading,
  Error,
  Fetched
}
export interface LoadStatus {
  status: RequestStatus.Init | RequestStatus.Loading;
  error: null;
  data: null;
}
export interface SuccessStatus<T> {
  status: RequestStatus.Fetched;
  error: null;
  data: T;
  options?: NVRequestOption | null;
}
export interface ErrorStatus {
  status: RequestStatus.Error;
  error: Error | NVError;
  data: null;
}

export type RequestType<T> = LoadStatus | SuccessStatus<T> | ErrorStatus;

export interface NVRequestOption {
  num?: number;
  pageID?: string | null;
  lastID?: string;
  shards?: string;
}

export interface NVRequestItems<T> {
  status: number; // Allow to give information about the query 0: does not exist 1: exist 2: deleted
  data: T;
  options: NVRequestOption | null;
}

export interface RequestArray<T> {
  status: number; // Allow to give information about the query 0: does not exist 1: exist 2: deleted
  data: T;
  options: NVRequestOption | null;
}
