import { IMerchantPayload } from './IMerchant';
import { ICustomerPayload } from './ICustomer';

export type AuthPayload = IMerchantPayload | ICustomerPayload;
