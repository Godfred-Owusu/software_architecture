import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class UpdatePostSlugDto {
  @IsString()
  @IsNotEmpty({ message: 'The new slug cannot be empty' })
  @MaxLength(150, { message: 'Slug is too long' })
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug must only contain lowercase letters, numbers, and hyphens (e.g., my-new-slug)',
  })
  slug: string;
}
