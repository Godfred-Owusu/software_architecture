import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SubscriptionEntity } from 'src/modules/notifications/domain/entities/subscription.entity';
import { SubscriptionRepository } from 'src/modules/notifications/domain/repositories/subscription.repository';
import { NotificationEntity } from 'src/modules/notifications/domain/entities/notification.entity';
import { NotificationRepository } from 'src/modules/notifications/domain/repositories/notification.repository';
import { TagEntity } from 'src/modules/tags/domain/entitties/tag.entity';
import { TagRepository } from 'src/modules/tags/domain/repositories/tag.repository';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { PostEntity } from 'src/modules/posts/domain/entities/post.entity';
import { PostRepository } from 'src/modules/posts/domain/repositories/post.repository';
import { CommentEntity } from 'src/modules/comments/domain/entities/comment.entity';
import { CommentRepository } from 'src/modules/comments/domain/repositories/comment.repository';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly tagRepository: TagRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async onApplicationBootstrap() {
    const users = await this.userRepository.listUsers();
    if (users && users.length > 0) return;

    console.log('🌱 Starting full system seed...');

    // 1. SEED USERS
    const reader = UserEntity.reconstitute({
      id: 'u1-reader-uuid',
      username: 'reader_user',
      email: 'reader@example.com',
      password: 'password123',
      role: 'reader',
    });

    const writer = UserEntity.reconstitute({
      id: 'u2-writer-uuid',
      username: 'writer_user',
      email: 'writer@example.com',
      password: 'password123',
      role: 'writer',
    });

    const moderator = UserEntity.reconstitute({
      id: 'u3-mod-uuid',
      username: 'moderator_user',
      email: 'moderator@example.com',
      password: 'password123',
      role: 'moderator',
    });

    const admin = UserEntity.reconstitute({
      id: 'u4-admin-uuid',
      username: 'admin_user',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    await this.userRepository.createUser(reader);
    await this.userRepository.createUser(writer);
    await this.userRepository.createUser(moderator);
    await this.userRepository.createUser(admin);

    // 2. SEED TAGS
    const tags = [
      'typescript',
      'nestjs',
      'architecture',
      'backend',
      'tutorial',
    ];
    for (const tagName of tags) {
      const tag = TagEntity.create(tagName);
      await this.tagRepository.save(tag);
    }

    // 3. SEED INITIAL SUBSCRIPTION
    const follow = SubscriptionEntity.create(reader.id, writer.id);
    await this.subscriptionRepository.save(follow);

    // 4. SEED A PUBLISHED POST WITH TAGS
    const tsTag = await this.tagRepository.findByName('typescript');
    const nestTag = await this.tagRepository.findByName('nestjs');

    const post = PostEntity.reconstitute({
      id: 'p1-sample-post',
      title: 'Mastering NestJS Architecture',
      content: 'This is a sample post about clean architecture...',
      slug: 'mastering-nestjs-architecture', // 👈 ADD THIS LINE
      authorId: writer.id,
      status: 'ACCEPTED',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });

    await this.postRepository.createPost(post);

    if (tsTag && nestTag) {
      await this.postRepository.addTagToPost(post.id, tsTag.id);
      await this.postRepository.addTagToPost(post.id, nestTag.id);
    }

    // 5. SEED COMMENTS
    const comment1 = CommentEntity.create(
      post.id,
      reader.id,
      'This is an incredibly helpful post! Thanks for sharing.',
    );
    const comment2 = CommentEntity.create(
      post.id,
      admin.id,
      'Excellent structure. Looking forward to more.',
    );

    await this.commentRepository.save(comment1);
    await this.commentRepository.save(comment2);

    // 6. SEED A SAMPLE NOTIFICATION
    const sampleNotification = NotificationEntity.create(
      writer.id,
      'NEW_COMMENT',
      'New Comment',
      `User reader_user commented on your post 'Mastering NestJS Architecture'`,
      `/posts/${post.id}#comment-${comment1.id}`,
      { postId: post.id, commentId: comment1.id },
    );

    await this.notificationRepository.save(sampleNotification);

    console.log('✅ Full Seed Complete:');
    console.log('- 4 Users, 5 Tags, 1 Subscription');
    console.log('- 1 Sample Post with 2 Tags and 2 Comments');
    console.log('- 1 Initial Notification for writer_user');
  }
}
