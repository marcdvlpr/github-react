import mongoose, { Schema, Document, model } from 'mongoose';

interface IMerchantModel extends Document {
  name: string;
  foodType: string[];
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  password: string;
  owner: string;
  serviceAvailable: boolean;
  coverImages: string[];
  rating: number;
  foods: any;
  latitude: number;
  longitude: number;
}

const merchantSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    foodType: {
      type: [String]
    },
    address: {
      type: String
    },
    postalCode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    owner: {
      type: String,
      required: true
    },
    serviceAvailable: {
      type: Boolean
    },
    coverImages: {
      type: [String]
    },
    rating: {
      type: Number
    },
    foods: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Food'
    }],
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

export const Merchant = model<IMerchantModel>('Merchant', merchantSchema);
