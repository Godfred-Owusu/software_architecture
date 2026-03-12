import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

@Injectable()
export class NotificationEventHandler {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  // 1. Post Pending Review -> Notify all moderators
  @OnEvent('post.pending_review')
  public async handlePostPendingReview(payload: {
    postId: string;
    title: string;
    authorId: string;
  }) {
    // Note: Ensure you have a findByRole method in your user repo!
    const moderators = await this.userRepository.findByRole('moderator');

    const notifications = moderators.map((mod) =>
      NotificationEntity.create(
        mod.id,
        'POST_PENDING_REVIEW',
        'New Post Pending Review',
        `New post pending review: '${payload.title}'`,
        `/posts/${payload.postId}`,
        { postId: payload.postId },
      ),
    );

    if (notifications.length > 0) {
      await this.notificationRepository.saveMany(notifications);
    }
  }

  // 2. Post Approved -> Notify Author AND Followers
  @OnEvent('post.approved')
  public async handlePostApproved(payload: {
    postId: string;
    title: string;
    authorId: string;
    authorUsername: string;
  }) {
    // A. Notify the Author
    const authorNotification = NotificationEntity.create(
      payload.authorId,
      'POST_APPROVED',
      'Post Approved',
      `Your post '${payload.title}' has been approved`,
      `/posts/${payload.postId}`,
      { postId: payload.postId },
    );
    await this.notificationRepository.save(authorNotification);

    // B. Notify all Followers
    // We use a large page size (e.g., 1000) to get followers, or ideally a dedicated method without pagination
    const [followers] = await this.subscriptionRepository.getFollowers(
      payload.authorId,
      1,
      1000,
    );

    const followerNotifications = followers.map((follower) =>
      NotificationEntity.create(
        follower.id,
        'NEW_POST_FROM_FOLLOWED',
        'New Post from Followed Author',
        `User ${payload.authorUsername} published a new post: '${payload.title}'`,
        `/posts/${payload.postId}`,
        { postId: payload.postId, authorId: payload.authorId },
      ),
    );

    if (followerNotifications.length > 0) {
      await this.notificationRepository.saveMany(followerNotifications);
    }
  }

  // 3. Post Rejected -> Notify Author
  @OnEvent('post.rejected')
  public async handlePostRejected(payload: {
    postId: string;
    title: string;
    authorId: string;
  }) {
    const notification = NotificationEntity.create(
      payload.authorId,
      'POST_REJECTED',
      'Post Rejected',
      `Your post '${payload.title}' has been rejected`,
      `/posts/${payload.postId}`,
      { postId: payload.postId },
    );
    await this.notificationRepository.save(notification);
  }

  // 4. Post Deleted -> Notify Author (if admin/mod deleted it)
  @OnEvent('post.deleted')
  public async handlePostDeleted(payload: {
    postId: string;
    title: string;
    authorId: string;
    deletedByUserId: string;
  }) {
    // Only notify if the person deleting is NOT the author [cite: 481-482, 489]
    if (payload.authorId !== payload.deletedByUserId) {
      const notification = NotificationEntity.create(
        payload.authorId,
        'POST_DELETED',
        'Post Deleted',
        `Your post '${payload.title}' has been deleted`,
        `/posts`, // Cannot link to a deleted post
        { postId: payload.postId },
      );
      await this.notificationRepository.save(notification);
    }
  }

  // 5. New Comment -> Notify Post Author
  @OnEvent('comment.created')
  public async handleCommentCreated(payload: {
    commentId: string;
    postId: string;
    postTitle: string;
    postAuthorId: string;
    commentAuthorId: string;
    commentAuthorUsername: string;
  }) {
    // Don't notify if the user is commenting on their own post [cite: 484-485, 489]
    if (payload.postAuthorId !== payload.commentAuthorId) {
      const notification = NotificationEntity.create(
        payload.postAuthorId,
        'NEW_COMMENT',
        'New Comment',
        `User ${payload.commentAuthorUsername} commented on your post '${payload.postTitle}'`,
        `/posts/${payload.postId}#comment-${payload.commentId}`,
        { postId: payload.postId, commentId: payload.commentId },
      );
      await this.notificationRepository.save(notification);
    }
  }
}
