import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotificationNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Notification with ID ${id} not found`, 'NOTIFICATION_NOT_FOUND'); // Ensure this maps to 404 in your filter
  }
}
