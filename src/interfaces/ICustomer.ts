export interface IEditCustomerProfileInput {
  firstName: string;
  lastName: string;
  address: string;
}

export interface ICustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface ICartItem {
  _id: string;
  quantity: number;
}

export interface IOrderInput {
  txId: string;
  amount: string;
  items: ICartItem[];
}
