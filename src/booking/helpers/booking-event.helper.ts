import { EventStatus } from 'src/generated/prisma/enums';

export function assertEventBookable(event: any, now: Date) {
  if (event.status !== EventStatus.ACTIVE)
    throw new Error('Event is not active');
  if (event.startTime <= now) throw new Error('Event already started');
}
