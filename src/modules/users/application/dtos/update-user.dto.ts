import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

// Match the case of your UserRole type (lowercase or uppercase)
const VALID_ROLES = ['admin', 'moderator', 'writer', 'reader'] as const;

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_ROLES, {
    message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
  })
  role?: UserRole;
}
