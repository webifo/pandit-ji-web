import { ObjectId } from 'mongodb';

export interface ISaitLang {
  en: string;
  np: string;
}

export interface ISaitTiming {
  type: string;
  title?: ISaitLang;
}

export interface ISait {
  _id?: ObjectId;
  ad: string;
  bs: string;
  date: Date;
  bs_year: number;
  timings: ISaitTiming[];
  source: string;
  fetchedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateSaitDTO = Omit<ISait, '_id' | 'createdAt' | 'updatedAt'>;

