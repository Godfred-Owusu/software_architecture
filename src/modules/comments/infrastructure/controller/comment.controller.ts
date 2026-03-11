import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { CreateCommentDto } from '../../application/dtos/create-comment.dto';
// 👇 Import your AuthGuard and user decorators (adjust paths as needed!)
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Controller('posts')
export class CommentController {
  constructor(private readonly createCommentUseCase: CreateCommentUseCase) {}

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard) // 👈 Business Rule: Only authenticated users can comment
  public async createComment(
    @Param('postId') postId: string,
    @Body() body: CreateCommentDto,
    @Requester() user: UserEntity,
  ) {
    return this.createCommentUseCase.execute(postId, user.id, body.content);
  }
}
