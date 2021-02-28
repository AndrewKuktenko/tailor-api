import { Document, Types } from 'mongoose';

export interface PatientModel extends Document {
    _id: Types.ObjectId;
    patientId: number;
    mrn: string;
    patientDob: Date;
    isPatientDeceased: string;
    deathDate: Date;
    lastName: string;
    firstName: string;
    gender: string;
    sex: string;
    addressLine: string;
    addressCity: string;
    addressState: string;
    addressZipCode: string;
}
