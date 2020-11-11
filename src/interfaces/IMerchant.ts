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
