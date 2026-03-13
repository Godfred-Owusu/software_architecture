// import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
// // 1. Add 'type' to the import to satisfy Error TS1272
// import type { UserRole } from '../../domain/entities/user.entity';

// // 2. Use 'as const' to help TS match the literal types
// const VALID_ROLES = ['admin', 'moderator', 'writer', 'reader'] as const;

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(3)
//   username: string;

//   @IsString()
//   @IsNotEmpty()
//   // 3. Use the array for runtime validation
//   @IsIn(VALID_ROLES, {
//     message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
//   })
//   // 4. Use 'string' here for the decorator metadata, but cast it for type safety
//   role: UserRole;

//   @IsString()
//   @IsNotEmpty()
//   @MinLength(8)
//   password: string;
// }

import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // 👈 Import ApiProperty
import type { UserRole } from '../../domain/entities/user.entity';

const VALID_ROLES = ['admin', 'moderator', 'writer', 'reader'] as const;

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the account',
    minLength: 3,
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'The access level assigned to the user',
    enum: VALID_ROLES,
    example: 'writer',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_ROLES, {
    message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Account password (minimum 8 characters)',
    minLength: 8,
    example: 'StrongPassword123!',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
