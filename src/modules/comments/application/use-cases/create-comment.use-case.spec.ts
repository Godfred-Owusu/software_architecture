import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCommentUseCase } from './create-comment.use-case';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { PostNotAcceptedException } from '../../domain/exceptions/post-not-accepted.exception';
import { PostNotFoundException } from '../../../posts/domain/exceptions/post-not-found.exception';

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;

  // 1. Mocks
  const mockCommentRepository = { save: jest.fn() };
  const mockPostRepository = { getPostById: jest.fn() };
  const mockUserRepository = { getUserById: jest.fn() };
  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentUseCase,
        { provide: CommentRepository, useValue: mockCommentRepository },
        { provide: PostRepository, useValue: mockPostRepository },
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<CreateCommentUseCase>(CreateCommentUseCase);
    jest.clearAllMocks();
  });

  it('should throw PostNotFoundException if post does not exist', async () => {
    mockPostRepository.getPostById.mockResolvedValue(null);

    await expect(
      useCase.execute('invalid-id', 'author-1', 'hello'),
    ).rejects.toThrow(PostNotFoundException);
  });

  it('should throw PostNotAcceptedException if post status is not ACCEPTED', async () => {
    // Mock a post that is still PENDING
    mockPostRepository.getPostById.mockResolvedValue({
      id: 'p1',
      status: 'PENDING',
    });

    await expect(useCase.execute('p1', 'author-1', 'hello')).rejects.toThrow(
      PostNotAcceptedException,
    );
  });

  it('should create a comment and emit event if post is ACCEPTED', async () => {
    // Setup Happy Path
    const mockPost = {
      id: 'p1',
      status: 'ACCEPTED',
      authorId: 'post-owner-id',
      toJSON: () => ({ title: 'Post Title' }),
    };
    const mockAuthor = {
      id: 'author-1',
      toJSON: () => ({ id: 'author-1', username: 'commenter' }),
    };

    mockPostRepository.getPostById.mockResolvedValue(mockPost);
    mockUserRepository.getUserById.mockResolvedValue(mockAuthor);
    mockCommentRepository.save.mockResolvedValue(null);

    const result = await useCase.execute('p1', 'author-1', 'Great post!');

    // Assertions
    expect(result).toHaveProperty('id');
    expect(result.content).toBe('Great post!');
    expect(mockCommentRepository.save).toHaveBeenCalled();
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      'comment.created',
      expect.any(Object),
    );
  });
});
