import { IsEmail, Length } from 'class-validator';

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(8, 40)
  password: string;
}
