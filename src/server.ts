import app from './app.js';
import { cleanupExpiredUsersJob } from './jobs/cleanupExpiredUsersJob.js';
import { makeServices } from './shared/factories/servicesFactory.js';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const { userService, validationTokenService } = makeServices();

const runCleanupExpiredUsersJob = () => {
  void cleanupExpiredUsersJob({ userService, validationTokenService });
};

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');

  runCleanupExpiredUsersJob();
  setInterval(runCleanupExpiredUsersJob, ONE_DAY_IN_MS);
});
