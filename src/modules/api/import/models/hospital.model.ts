import { Document, Types } from 'mongoose';

export type Status = 'active' | 'ordered';

export interface HospitalModel extends Document {
  _id: Types.ObjectId;
  treatmentId: number;
  patientId: number;
  status: Status;
  diagnose: string;
  numberOfCycles: string;
  treatmentLine: string;
  startDate: Date;
  endDate: Date;
}
