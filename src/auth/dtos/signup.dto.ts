import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @MinLength(8)
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    role: string;
}