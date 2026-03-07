import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';

import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { GetAllTagsUseCase } from '../../application/use-cases/get-all-tags.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';

import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';
import { InvalidTagNameException } from '../../domain/values-objects/tag-name.value-object';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly getAllTagsUseCase: GetAllTagsUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tag (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Tag successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid name format' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not an admin' })
  @ApiResponse({ status: 409, description: 'Conflict: Tag already exists' })
  async create(@Body() dto: CreateTagDto, @Requester() user: UserEntity) {
    const tag = await this.createTagUseCase.execute(dto.name, user);
    return {
      id: tag.id,
      name: tag.name.toString(),
      createdAt: tag.createdAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all tags' })
  @ApiResponse({ status: 200, description: 'Returns an array of tags' })
  async findAll() {
    const tags = await this.getAllTagsUseCase.execute();
    return {
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name.toString(),
        createdAt: tag.createdAt,
      })),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a tag (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Tag successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not an admin' })
  @ApiResponse({ status: 404, description: 'Not Found: Tag does not exist' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: New name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
    @Requester() user: UserEntity,
  ) {
    if (!dto.name) {
      throw new InvalidTagNameException();
    }
    const tag = await this.updateTagUseCase.execute(id, dto.name, user);
    return {
      id: tag.id,
      name: tag.name.toString(),
      createdAt: tag.createdAt,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204) // 204 No Content is required for DELETE by the exam specs!
  @ApiOperation({ summary: 'Delete a tag (ADMIN only)' })
  @ApiResponse({ status: 204, description: 'Tag successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not an admin' })
  @ApiResponse({ status: 404, description: 'Not Found: Tag does not exist' })
  async delete(@Param('id') id: string, @Requester() user: UserEntity) {
    await this.deleteTagUseCase.execute(id, user);
  }
}
