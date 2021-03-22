import { Schema, Document, model } from 'mongoose';
import { IOrderModel } from './Order';

interface ICustomerModel extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otpExpiry: Date;
  latitude: number;
  longitude: number;
  cart: any[];
  orders: IOrderModel[];
}

const customerSchema = new Schema(
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
    },
    cart: [{
      food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    orders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }]
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
