import { ObjectId } from 'mongodb';
import { Language, RashifalType } from "./type";

export interface IRashifalLang {
  en: string;
  np: string;
}

export interface IRashifalItem {
  rashi: IRashifalLang;
  description: IRashifalLang;
}

export interface IRashifal {
  _id?: ObjectId;
  type: RashifalType;
  date: Date;
  title: IRashifalLang;
  author: IRashifalLang;
  rashifal: IRashifalItem[];
  source: string;
  fetchedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateRashifalDTO = Omit<IRashifal, '_id' | 'createdAt' | 'updatedAt'>;