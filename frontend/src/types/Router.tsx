import { ReactElement, JSXElementConstructor } from 'react';

export interface RouteParams {
  tabIdx: number;
  targetURL: string;
  i18nLabel: string;
  Icon?: string | ReactElement<any, string | JSXElementConstructor<any>>;
  child?: RouteParams[];
}