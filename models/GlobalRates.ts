import { ObjectId } from 'mongodb';

export interface IGlobalRates {
  _id?: ObjectId;
  curr: string;
  xauPrice: number;
  xauClose: number;
  xagPrice: number;
  xagClose: number;
  pcXau: number;
  pcXag: number;
  chgXau: number;
  chgXag: number;
  source: string;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateGlobalRatesDTO = Omit<IGlobalRates, '_id' | 'createdAt' | 'updatedAt'>;