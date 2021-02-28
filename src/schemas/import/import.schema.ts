import * as mongoose from 'mongoose';

export const importSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    dataFileUrl: {
      type: String,
    },
    source: {
      type: String,
      enum: ['patient', 'hospital'],
    },
    status: {
      type: String,
      enum: ['in_progress', 'failed', 'done'],
    },
    type: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);
