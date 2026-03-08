// import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    example: 'typescript',
    description:
      'The name of the tag. Must be lowercase, alphanumeric, and may contain hyphens.',
    minLength: 2,
    maxLength: 50,
  })
  name!: string;
}
