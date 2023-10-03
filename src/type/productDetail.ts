import { GroupDetail } from './groupDetail';

export type ProductDetail = {
  id: number;
  name: string;
  tax: number;
  barcode: string;
  groups?: GroupDetail[];
};
