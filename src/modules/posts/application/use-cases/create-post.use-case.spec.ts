import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostUseCase } from './create-post.use-case';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
  let postRepo: PostRepository;

  // 1. Mock Repository
  const mockPostRepository = {
    existsBySlug: jest.fn(),
    createPost: jest.fn().mockResolvedValue(null),
  };

  // 2. Mock User with "unknown" bridge to avoid TS error
  const mockUser = {
    id: 'user-123',
    username: 'testuser',
  } as unknown as UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostUseCase,
        { provide: PostRepository, useValue: mockPostRepository },
      ],
    }).compile();

    useCase = module.get<CreatePostUseCase>(CreatePostUseCase);
    postRepo = module.get<PostRepository>(PostRepository);

    jest.clearAllMocks();
  });

  it('should generate a slug from the title and save the post', async () => {
    const input = {
      title: 'Hello World Post',
      content: 'This is some content',
      authorId: 'user-123',
    };

    mockPostRepository.existsBySlug.mockResolvedValue(false);

    const result = await useCase.execute(input, mockUser);

    expect(result.slug).toBe('hello-world-post');
    expect(mockPostRepository.createPost).toHaveBeenCalled();
  });

  it('should generate a unique slug if the primary one already exists', async () => {
    const input = {
      title: 'Unique Post',
      content: 'Content here',
      authorId: 'user-123',
    };

    mockPostRepository.existsBySlug
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const result = await useCase.execute(input, mockUser);

    expect(result.slug).toBe('unique-post-2');
  });
});
