import { UserEntity } from '../../../users/domain/entities/user.entity';

export class TagsPermissions {
  public static canManage(user: UserEntity): boolean {
    return user.hasRole('admin');
  }
}
