import { UserType, AuthenticatedUser } from '@Common';

export function assertAdminOrManager(ctx: AuthenticatedUser) {
  if (ctx.type !== UserType.ADMIN && ctx.type !== UserType.MANAGER) {
    throw new Error('Only admin and manager are allowed');
  }
}

export function validateEventTimes(startTime: Date, endTime: Date) {
  const now = new Date();

  if (startTime.getTime() <= now.getTime()) {
    throw new Error('Event startTime and date must be in the past ');
  }
  if (startTime.getTime() >= endTime.getTime()) {
    throw new Error('endTime must be after startTime');
  }

  const durationMs = endTime.getTime() - startTime.getTime();
  const thirtyMinutes = 30 * 60 * 1000;

  if (durationMs < thirtyMinutes) {
    throw new Error('Event duration must be at least 30 minutes');
  }
}

export function validateCapacity(
  maxTickets: number,
  venueTotalCapacity: number,
) {
  if (maxTickets > venueTotalCapacity) {
    throw new Error(
      `maxTickets (${maxTickets}) cannot exceed venueTotalCapacity (${venueTotalCapacity})`,
    );
  }
}
