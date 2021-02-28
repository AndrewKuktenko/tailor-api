import { Document, Types } from 'mongoose';

export type ImportSource = 'patient' | 'hospital';
export type ImportType = 'file' | 'csv' | 'xlsx';
export type ImportStatus = 'in_progress' | 'failed' | 'done';

export interface ImportModel extends Document {
  _id: Types.ObjectId;
  name: string;
  dataFileUrl: string;
  source: ImportSource;
  type: ImportType;
  status: ImportStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
