import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
// 1. Add 'type' to the import to satisfy Error TS1272
import type { UserRole } from '../../domain/entities/user.entity';

// 2. Use 'as const' to help TS match the literal types
const VALID_ROLES = ['admin', 'moderator', 'writer', 'reader'] as const;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  // 3. Use the array for runtime validation
  @IsIn(VALID_ROLES, {
    message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
  })
  // 4. Use 'string' here for the decorator metadata, but cast it for type safety
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
