import { Schema, Document, model } from 'mongoose';

export interface IOrderModel extends Document {
  orderId: string;
  merchantId: string;
  items: any[];
  totalAmount: number;
  paidAmount: number;
  orderDate: Date;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  readyTime: number;
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
    paidAmount: {
      type: Number,
      required: true
    },
    orderDate: {
      type: Date
    },
    orderStatus: {
      type: String
    },
    remarks: {
      type: String
    },
    deliveryId: {
      type: String
    },
    readyTime: {
      type: Number
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
