export interface ICreateMerchantInput {
  name: string;
  foodType: string[];
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  password: string;
  owner: string;
}

export interface IMerchantPayload {
  _id: string;
  email: string;
  name: string;
}

export interface IMerchantLoginInput {
  email: string;
  password: string;
}

export interface IEditMerchantInput {
  name: string;
  foodType: string[];
  address: string;
  phone: string;
}

export interface ICreateOfferInput {
  offerType: string;
  merchant: any[];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: string;
  bank: any[];
  bins: any[];
  zipCode: string;
  isActive: boolean;
}
