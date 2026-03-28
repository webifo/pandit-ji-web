import { ObjectId } from 'mongodb';

export interface IGoldSilver {
  _id?: ObjectId;
  gold: number | null;
  silver: number | null;
  source: string;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateGoldSilverDTO = Omit<IGoldSilver, '_id' | 'createdAt' | 'updatedAt'>;