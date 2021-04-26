import { IsEmail, Length } from 'class-validator';

export class CustomerRegisterInput {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(8, 40)
  password: string;
}

export class CustomerLoginInput {
  @IsEmail()
  email: string;

  @Length(8, 40)
  password: string;
}
