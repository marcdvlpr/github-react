import { Schema, Document, model } from 'mongoose';

interface ITransaction extends Document {
  customer: string;
  merchantId: string;
  orderId: string;
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
}

const transactionSchema = new Schema(
  {
    customer: {
      type: String
    },
    merchantId: {
      type: String
    },
    orderId: {
      type: String
    },
    orderValue: {
      type: Number
    },
    offerUsed: {
      type: String
    },
    status: {
      type: String
    },
    paymentMode: {
      type: String
    },
    paymentResponse: {
      type: String
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      }
    },
    timestamps: true
  }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
