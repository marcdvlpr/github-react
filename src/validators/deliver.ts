import { IsEmail, Length } from 'class-validator';

export class DeliverRegisterInput {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(8, 40)
  password: string;

  @Length(2, 16)
  firstName: string;

  @Length(2, 16)
  lastName: string;

  @Length(6, 40)
  address: string;

  @Length(4, 10)
  postalCode: string;
}

export class DeliverLoginInput {
  @IsEmail()
  email: string;

  @Length(8, 40)
  password: string;
}

export class EditDeliverProfileInput {
  @Length(2, 16)
  firstName: string;

  @Length(2, 16)
  lastName: string;

  @Length(6, 40)
  address: string;
}
