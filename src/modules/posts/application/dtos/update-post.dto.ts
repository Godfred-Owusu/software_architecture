import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'New Title' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: 'New Content' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content?: string;
}
