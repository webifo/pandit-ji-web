import { ObjectId } from 'mongodb';

export interface IHolidayLang {
  en: string;
  ne: string;
}

export interface IHoliday {
  _id?: ObjectId;
  ad: string;
  bs: string;
  date: Date;
  title: IHolidayLang;
  description?: IHolidayLang;
  holiday_type?: string;
  image_small_url?: string;
  bs_year: number;
  based_on: string[];
  source: string;
  fetchedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateHolidayDTO = Omit<IHoliday, '_id' | 'createdAt' | 'updatedAt'>;