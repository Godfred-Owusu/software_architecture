import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { GetMyNotificationsUseCase } from '../../application/use-case/get-my-notifications.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use-case/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../../application/use-case/mark-all-notifications-as-read.use-case';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getMyNotificationsUseCase: GetMyNotificationsUseCase,
    private readonly markAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllAsReadUseCase: MarkAllNotificationsAsReadUseCase,
  ) {}

  @Get()
  public async getMyNotifications(
    @Requester() user: any,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('isRead') isRead: 'true' | 'false' | 'all' = 'all',
  ) {
    return this.getMyNotificationsUseCase.execute(
      user.id,
      +page,
      +pageSize,
      isRead,
    );
  }

  @Patch(':id/read')
  public async markAsRead(@Param('id') id: string, @Requester() user: any) {
    return this.markAsReadUseCase.execute(id, user.id);
  }

  @Post('mark-all-read')
  @HttpCode(200)
  public async markAllRead(@Requester() user: any) {
    return this.markAllAsReadUseCase.execute(user.id);
  }
}
