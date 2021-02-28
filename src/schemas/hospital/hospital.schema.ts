import * as mongoose from 'mongoose';

export const hospitalSchema = new mongoose.Schema(
  {
    treatmentId: {
      type: String,
    },
    patientId: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'ordered'],
    },
    diagnose: {
      type: String,
    },
    numberOfCycles: {
      type: String,
    },
    treatmentLine: {
      type: String,
    },
    displayName: {
      type: String,
    },
    protocolId: {
        type: Number,
    }
  },
  { timestamps: true, versionKey: false },
);

