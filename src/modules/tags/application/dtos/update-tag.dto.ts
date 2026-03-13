import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({
    example: 'typescript',
    description:
      'The name of the tag. Must be lowercase, alphanumeric, and may contain hyphens.',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'Tag name must be between 2 and 50 characters' })
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Tag name must be lowercase, alphanumeric, and may contain hyphens only',
  })
  name?: string;
}
