import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Get,
  Query,
  Patch,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { CreateCommentDto } from '../../application/dtos/create-comment.dto';
// 👇 Import your AuthGuard and user decorators (adjust paths as needed!)
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { ListCommentsUseCase } from '../../application/use-cases/list-comments.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { GetCommentCountUseCase } from '../../application/use-cases/get-comment-count.use-case';

@Controller('posts')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
    private readonly getCommentCountUseCase: GetCommentCountUseCase,
  ) {}

  @Get(':postId/comments/count')
  public async getCommentCount(@Param('postId') postId: string) {
    return this.getCommentCountUseCase.execute(postId);
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Requester() user: UserEntity,
  ) {
    return this.createCommentUseCase.execute(
      postId,
      user.id,
      createCommentDto.content,
    );
  }

  @Get(':postId/comments')
  // No @UseGuards here because the exam says Authorization is not required to read!
  public async getComments(
    @Param('postId') postId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    // Parse query params, applying exam defaults if not provided
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedPageSize = pageSize
      ? Math.min(parseInt(pageSize, 10), 100)
      : 20; // Max 100 per exam rules
    const validSortBy = sortBy === 'updatedAt' ? 'updatedAt' : 'createdAt';
    const validOrder = order === 'asc' ? 'asc' : 'desc';

    return this.listCommentsUseCase.execute(
      postId,
      parsedPage,
      parsedPageSize,
      validSortBy,
      validOrder,
    );
  }
}
