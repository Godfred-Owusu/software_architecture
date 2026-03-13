import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FollowUserUseCase } from './follow-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { SubscriptionRepository } from '../../../notifications/domain/repositories/subscription.repository';
import { CannotFollowSelfException } from '../../../notifications/domain/exceptions/cannot-follow-self.exception';

describe('FollowUserUseCase', () => {
  let useCase: FollowUserUseCase;

  // 1. Mocks
  const mockUserRepository = {
    getUserById: jest.fn(),
  };
  const mockSubscriptionRepository = {
    isFollowing: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowUserUseCase,
        { provide: UserRepository, useValue: mockUserRepository },
        {
          provide: SubscriptionRepository,
          useValue: mockSubscriptionRepository,
        },
      ],
    }).compile();

    useCase = module.get<FollowUserUseCase>(FollowUserUseCase);
    jest.clearAllMocks();
  });

  it('should throw CannotFollowSelfException when followerId equals followedId', async () => {
    await expect(useCase.execute('user-1', 'user-1')).rejects.toThrow(
      CannotFollowSelfException,
    );
  });

  it('should throw NotFoundException if target user does not exist', async () => {
    mockUserRepository.getUserById.mockResolvedValue(null);

    await expect(
      useCase.execute('follower-id', 'non-existent-id'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create and save a subscription if not already following', async () => {
    mockUserRepository.getUserById.mockResolvedValue({ id: 'followed-id' });
    mockSubscriptionRepository.isFollowing.mockResolvedValue(false);
    mockSubscriptionRepository.save.mockResolvedValue(null);

    const result = await useCase.execute('follower-id', 'followed-id');

    expect(result.followerId).toBe('follower-id');
    expect(result.followedId).toBe('followed-id');
    expect(mockSubscriptionRepository.save).toHaveBeenCalled();
  });

  it('should return subscription but not call save if already following (idempotency)', async () => {
    mockUserRepository.getUserById.mockResolvedValue({ id: 'followed-id' });
    mockSubscriptionRepository.isFollowing.mockResolvedValue(true);

    const result = await useCase.execute('follower-id', 'followed-id');

    expect(result).toBeDefined();
    expect(mockSubscriptionRepository.save).not.toHaveBeenCalled();
  });
});
