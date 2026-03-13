import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: 'Comment content must be a string' })
  @IsNotEmpty({ message: 'Comment content cannot be empty if provided' })
  @MinLength(1, { message: 'Comment must be at least 1 character long' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content?: string;
}
