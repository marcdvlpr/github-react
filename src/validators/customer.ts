import { IsEmail, Length } from 'class-validator';

export class customerRegisterInput {
  @IsEmail()
  email: string;

  @Length(10)
  phone: string;

  @Length(8, 40)
  password: string;
}

export class customerLoginInput {
  @IsEmail()
  email: string;

  @Length(8, 40)
  password: string;
}
