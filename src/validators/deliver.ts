import { IsEmail, Length } from 'class-validator';

export class DeliverRegisterInput {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(8, 40)
  password: string;

  @Length(3, 14)
  firstName: string;

  @Length(3, 14)
  lastName: string;

  @Length(6, 40)
  address: string;

  @Length(4, 10)
  zipCode: string;
}

export class DeliverLoginInput {
  @IsEmail()
  email: string;

  @Length(8, 40)
  password: string;
}
