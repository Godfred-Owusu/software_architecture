import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from '../../application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from '../../application/use-cases/get-following.use-case';

@Controller('users') // 👈 Base route matching the exam
export class UserSubscriptionController {
  constructor(
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getFollowersUseCase: GetFollowersUseCase,
    private readonly getFollowingUseCase: GetFollowingUseCase,
  ) {}

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200) // 👈 Exam explicitly requires 200 OK, not 201 Created [cite: 494]
  public async follow(
    @Param('userId') targetUserId: string,
    @Requester() jwtPayload: any,
  ) {
    return this.followUserUseCase.execute(jwtPayload.id, targetUserId);
  }

  @Delete(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204) // 👈 Exam requires 204 No Content [cite: 510]
  public async unfollow(
    @Param('userId') targetUserId: string,
    @Requester() jwtPayload: any,
  ) {
    await this.unfollowUserUseCase.execute(jwtPayload.id, targetUserId);
  }

  @Get(':userId/followers')
  // No auth guard required for viewing followers [cite: 519]
  public async getFollowers(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedPageSize = pageSize
      ? Math.min(parseInt(pageSize, 10), 100)
      : 20;
    return this.getFollowersUseCase.execute(userId, parsedPage, parsedPageSize);
  }

  @Get(':userId/following')
  // No auth guard required for viewing following [cite: 543]
  public async getFollowing(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedPageSize = pageSize
      ? Math.min(parseInt(pageSize, 10), 100)
      : 20;
    return this.getFollowingUseCase.execute(userId, parsedPage, parsedPageSize);
  }
}
