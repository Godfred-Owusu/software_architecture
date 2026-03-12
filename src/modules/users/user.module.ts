import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { UserController } from './infrastructure/controllers/user.controller';
import { SQLiteUserRepository } from './infrastructure/repositories/user.sqlite.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteUserEntity } from './infrastructure/entities/user.sqlite.entity';
import { SQLiteSubscriptionEntity } from './infrastructure/entities/sqlite-subscription.entity';
import { SubscriptionRepository } from '../notifications/domain/repositories/subscription.repository';
import { SqliteSubscriptionRepository } from './infrastructure/repositories/sqlite-subscription.repository';
import { FollowUserUseCase } from './application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from './application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from './application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from './application/use-cases/get-following.use-case';
import { UserSubscriptionController } from './infrastructure/controllers/subscription.controller';

@Module({
  imports: [
    LoggingModule,
    TypeOrmModule.forFeature([SQLiteUserEntity, SQLiteSubscriptionEntity]),
  ],
  controllers: [UserController, UserSubscriptionController],
  providers: [
    {
      provide: UserRepository,
      useClass: SQLiteUserRepository,
    },
    {
      provide: SubscriptionRepository,
      useClass: SqliteSubscriptionRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetFollowersUseCase,
    GetFollowingUseCase,
  ],
  exports: [UserRepository, SubscriptionRepository],
})
export class UserModule {}
