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
