import { Schema, Document, model } from 'mongoose';

interface ICustomerModel extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otpExpiry: number;
  latitude: number;
  longitude: number;
}

const customerSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type:String
    },
    address: {
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
      type: Date
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
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

export const Customer = model<ICustomerModel>('Customer', customerSchema);
