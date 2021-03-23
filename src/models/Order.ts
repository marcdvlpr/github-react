import { Schema, Document, model } from 'mongoose';

export interface IOrderModel extends Document {
  orderId: string;
  merchantId: string;
  items: any[];
  totalAmount: number;
  orderDate: Date;
  paidThrough: string;
  paymentResponse: string;
  orderStatus: string;
}

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    merchantId: {
      type: String,
      required: true
    },
    items: [{
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
    totalAmount: {
      type: Number,
      required: true
    },
    orderDate: {
      type: Date
    },
    paidThrough: {
      type: String
    },
    paymentResponse: {
      type: String
    },
    orderStatus: {
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

export const Order = model<IOrderModel>('Order', orderSchema);
