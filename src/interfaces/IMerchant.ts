export interface ICreateMerchantInput {
  name: string;
  foodType: string[];
  address: string;
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
