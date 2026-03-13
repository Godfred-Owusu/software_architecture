import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  public async listUsers() {
    const users = await this.listUsersUseCase.execute();
    return users.map((u) => u.toJSON());
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves the public profile of a user by their unique UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the user',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0',
  })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-g7h8-i9j0',
        username: 'godfrey_dev',
        role: 'author',
        createdAt: '2026-03-13T21:10:44Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  public async getUserById(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return user?.toJSON();
  }

  @Post()
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with a specified role (author, moderator, or admin).',
  })
  @ApiBody({ type: CreateUserDto }) // 👈 Tells Swagger to use your DTO fields for the request body
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-g7h8-i9j0',
        username: 'new_user',
        role: 'writer',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Validation failed (e.g., username taken or password too short).',
  })
  public async createUser(@Body() input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }
  @Patch(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, input);
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
