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
import { UpdateCommentDto } from '../../application/dtos/update-comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentRootController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly getCommentCountUseCase: GetCommentCountUseCase,
  ) {}

  @Patch(':id')
  public async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Requester() jwtPayload: any,
  ) {
    return this.updateCommentUseCase.execute(
      id,
      jwtPayload.id,
      updateCommentDto.content!,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteComment(
    @Param('id') id: string,
    @Requester() jwtPayload: any,
  ) {
    await this.deleteCommentUseCase.execute(id, jwtPayload.id);
  }
}
