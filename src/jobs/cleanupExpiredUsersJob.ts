import type { IUserService } from '../modules/users/users.service.js';
import type { IValidationTokenService } from '../modules/validation-token/validation-token.service.js';

interface CleanupExpiredUsersJobDependencies {
  userService: IUserService;
  validationTokenService: IValidationTokenService;
}

export async function cleanupExpiredUsersJob(deps: CleanupExpiredUsersJobDependencies): Promise<void> {
  try {
    const deletedTokens = await deps.validationTokenService.deleteExpiredTokens();
    const deletedUsers = await deps.userService.deleteExpiredUnverifiedUsers();

    console.log(`Expired tokens deleted: ${deletedTokens.count}`);
    console.log(`Expired unverified users deleted: ${deletedUsers.count}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Cleanup expired users job failed: ${error.message}`);
    }
  }
}
