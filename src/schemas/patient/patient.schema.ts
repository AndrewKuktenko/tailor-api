import * as mongoose from 'mongoose';

export const patientSchema = new mongoose.Schema(
  {
    patientId: {
        type: Number,
    },
    mrn: {
        type: String,
    },
    patientDob: {
        type: Date,
    },
    isPatientDeceased: {
        type: String,
    },
    deathDate: {
        type: Date,
    },
    lastName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    gender: {
        type: String,
    },
    sex: {
        type: String,
    },
    addressLine: {
        type: String,
    },
    addressCity: {
        type: String,
    },
    addressState: {
        type: String,
    },
    addressZipCode: {
        type: String,
    }
  },
  { timestamps: true, versionKey: false },
);