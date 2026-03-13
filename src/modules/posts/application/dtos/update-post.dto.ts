import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
} from 'class-validator';

// Define valid statuses to match your PostEntity logic
const VALID_STATUSES = ['DRAFT', 'PENDING', 'ACCEPTED', 'REJECTED'] as const;

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_STATUSES, {
    message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
  })
  status?: string;

  // Note: authorId is omitted here.
  // We usually don't allow updating the authorId via a DTO
  // for security reasons. Use the JWT token instead!
}
