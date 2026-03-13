import { ApprovePostUseCase } from './../../application/use-cases/approve-post.use-case';
import { SubmitPostUseCase } from './../../application/use-cases/submit-post.use-case';
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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug.use-case';
import { UpdatePostSlugDto } from '../../application/dtos/update-post-slug.dto';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';
import { RejectPostUseCase } from '../../application/use-cases/reject-post.use-case';

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
    private readonly updatePostSlugUseCase: UpdatePostSlugUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly submitPostUseCase: SubmitPostUseCase,
    private readonly rejectPostUseCase: RejectPostUseCase,
    private readonly approvePostUseCase: ApprovePostUseCase,
  ) {}

  @Get()
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Comma-separated tags',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
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

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // public async createPost(
  //   @Requester() user: UserEntity,
  //   @Body() input: Omit<CreatePostDto, 'authorId'>,
  // ) {
  //   return this.createPostUseCase.execute(
  //     { ...input, authorId: user.id },
  //     user,
  //   );
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Shows the "Lock" icon in Swagger for JWT
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Available for writers and admins.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'My First Post' },
        content: { type: 'string', example: 'This is the body of the post.' },
      },
      required: ['title', 'content'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have permission to post.',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a post',
    description:
      'Updates post content. Only the author or an admin can perform this action.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the post',
    example: '61fb52b5-8c3d-4ed4-b25f-9fd8ec95f9ff',
  })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not own this post.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Requester() user: UserEntity,
  ) {
    return this.updatePostUseCase.execute(id, body, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a post',
    description:
      'Permanently removes a post. Only the author or an admin can delete it.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the post to delete',
    example: '61fb52b5-8c3d-4ed4-b25f-9fd8ec95f9ff',
  })
  @ApiResponse({
    status: 204,
    description: 'Post successfully deleted. No content returned.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing token.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have permission to delete this post.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async deletePost(@Param('id') id: string, @Requester() user: any) {
    return this.deletePostUseCase.execute(id, user.id);
  }

  // @Post(':id/tags/:tagId')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(200)
  // @ApiOperation({ summary: 'Add a tag to a post (Author or Admin only)' })
  // @ApiResponse({ status: 200, description: 'Tag successfully added to post' }) // Updated to 200
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden: Not the author or admin',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Not Found: Post or Tag does not exist',
  // })
  // async addTag(
  //   @Param('id') postId: string,
  //   @Param('tagId') tagId: string,
  //   @Requester() user: UserEntity,
  // ) {
  //   return await this.addTagToPostUseCase.execute(postId, tagId, user);
  // }

  @Post(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Add a tag to a post',
    description:
      'Associates an existing tag with a specific post. Restricted to the post author or an administrator.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the post',
    example: '61fb52b5-8c3d-4ed4-b25f-9fd8ec95f9ff',
  })
  @ApiParam({
    name: 'tagId',
    description: 'The UUID of the tag to add',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0',
  })
  @ApiResponse({ status: 200, description: 'Tag successfully added to post.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not the author or an admin.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - The post or tag ID does not exist.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Tag is already attached to this post.',
  }) // Optional but helpful
  public async addTagToPost(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Requester() user: UserEntity,
  ) {
    return this.addTagToPostUseCase.execute(id, tagId, user);
  }

  @Delete(':id/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove a tag from a post',
    description:
      'Deletes the association between a post and a tag. Only the author or an admin can perform this.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the post',
    example: '61fb52b5-8c3d-4ed4-b25f-9fd8ec95f9ff',
  })
  @ApiParam({
    name: 'tagId',
    description: 'The UUID of the tag to remove',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0',
  })
  @ApiResponse({
    status: 204,
    description: 'Tag successfully removed from post.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not the author or an admin.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - The post or the tag association does not exist.',
  })
  async removeTag(
    @Param('id') postId: string,
    @Param('tagId') tagId: string,
    @Requester() user: UserEntity,
  ) {
    await this.removeTagFromPostUseCase.execute(postId, tagId, user);
  }

  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update post slug',
    description:
      'Updates the URL-friendly identifier of a post. Only authors or admins can change this.',
  })
  @ApiParam({ name: 'id', description: 'Post UUID' })
  @ApiResponse({ status: 200, description: 'Slug updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid slug format or slug already in use.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Unauthorized to edit this post.',
  })
  public async updateSlug(
    @Param('id') id: string,
    @Body() updatePostSlugDto: UpdatePostSlugDto,
    @Requester() user: UserEntity,
  ) {
    return this.updatePostSlugUseCase.execute(id, updatePostSlugDto.slug, user);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get post by slug',
    description: 'Retrieves a single post using its URL-friendly slug.',
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug string (e.g., "my-first-post")',
    example: 'my-first-post',
  })
  @ApiResponse({ status: 200, description: 'Post found.' })
  @ApiResponse({ status: 404, description: 'Post with this slug not found.' })
  public async getBySlug(
    @Param('slug') slug: string,
    @Requester() user: UserEntity,
  ) {
    return this.getPostBySlugUseCase.execute(slug, user);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Reject a post',
    description:
      'Changes the post status to "rejected". This action is typically restricted to Moderators or Admins.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the post to reject',
    example: '61fb52b5-8c3d-4ed4-b25f-9fd8ec95f9ff',
  })
  @ApiResponse({ status: 200, description: 'Post successfully rejected.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have permission to reject posts.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - The post ID does not exist.',
  })
  public async rejectPost(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    return this.rejectPostUseCase.execute(id, user);
  }

  @Post(':id/submit-for-review')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Submit post for review',
    description:
      'Changes post status from "draft" to "reviewing". Usually restricted to the post author.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the post' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully submitted for review.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only the author can submit this post.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async submitForReview(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    return this.submitPostUseCase.execute(id, user);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Approve a post',
    description:
      'Changes post status to "accepted", making it visible to the public. Restricted to Admins/Moderators.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the post' })
  @ApiResponse({ status: 200, description: 'Post successfully approved.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Insufficient permissions to approve posts.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  public async approvePost(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    return this.approvePostUseCase.execute(id, user);
  }
}
