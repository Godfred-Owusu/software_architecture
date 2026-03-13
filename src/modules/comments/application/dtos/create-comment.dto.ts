import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateCommentDto {
  @IsString({ message: 'Comment content must be a string' })
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @MinLength(1, { message: 'Comment must be at least 1 character long' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content: string;
}
