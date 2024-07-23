import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsNumber,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  @MinLength(8)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
