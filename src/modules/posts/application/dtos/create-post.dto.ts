import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Post title is required' })
  @MinLength(5, { message: 'Title is too short (min 5 characters)' })
  @MaxLength(100, { message: 'Title is too long (max 100 characters)' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Post content cannot be empty' })
  @MinLength(10, { message: 'Content should be at least 10 characters long' })
  content: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;
}
