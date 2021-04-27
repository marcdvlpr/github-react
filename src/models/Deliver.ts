import { Schema, Document, model } from 'mongoose';

interface IDeliverModel extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  phone: string;
  verified: boolean;
  otp: number;
  otpExpiry: Date;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
}

const deliverSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    address: {
      type: String
    },
    zipCode: {
      type: String
    },
    phone: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean
    },
    otp: {
      type: Number
    },
    otpExpiry: {
      type: Number
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    isAvailable: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      }
    },
    timestamps: true
  }
);

export const Deliver = model<IDeliverModel>('Deliver', deliverSchema);
