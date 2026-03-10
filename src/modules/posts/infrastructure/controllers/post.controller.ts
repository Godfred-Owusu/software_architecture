import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { AddTagToPostUseCase } from '../../application/use-cases/add-tag-to-post.use-case';
import { RemoveTagFromPostUseCase } from '../../application/use-cases/remove-tag-from-post.use-case';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
    private readonly removeTagFromPostUseCase: RemoveTagFromPostUseCase,
  ) {}

  @Get()
  async getPosts(
    @Query('tags') tagsQuery?: string,
    @Query('page') pageQuery?: string,
    @Query('pageSize') pageSizeQuery?: string,
    @Requester() user?: UserEntity,
  ) {
    const tagsArray = tagsQuery
      ? tagsQuery.split(',').map((tag) => tag.trim())
      : undefined;
    const page = pageQuery ? parseInt(pageQuery, 10) : 1;
    const pageSize = pageSizeQuery ? parseInt(pageSizeQuery, 10) : 20;

    // Pass the user to the Use Case
    return await this.getPostsUseCase.execute(tagsArray, page, pageSize, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);

    return post?.toJSON();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    return this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
  }

  @Patch(':id')
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @Delete(':id')
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }

  @Post(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Add a tag to a post (Author or Admin only)' })
  @ApiResponse({ status: 200, description: 'Tag successfully added to post' }) // Updated to 200
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Not the author or admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Post or Tag does not exist',
  })
  async addTag(
    @Param('id') postId: string,
    @Param('tagId') tagId: string,
    @Requester() user: UserEntity,
  ) {
    return await this.addTagToPostUseCase.execute(postId, tagId, user);
  }
  @Delete(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204) // 204 No Content is standard for DELETE requests
  @ApiOperation({ summary: 'Remove a tag from a post (Author or Admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Tag successfully removed from post',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Not the author or admin',
  })
  @ApiResponse({ status: 404, description: 'Not Found: Post does not exist' })
  async removeTag(
    @Param('id') postId: string,
    @Param('tagId') tagId: string,
    @Requester() user: UserEntity,
  ) {
    await this.removeTagFromPostUseCase.execute(postId, tagId, user);
  }
}
