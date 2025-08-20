import { app } from './app.js';
import { connectDB } from './db.js';
import { config } from './config.js';
import { startDeactivateJob } from './jobs/deactivateInactiveDevices.js';

(async () => {
  await connectDB();
  startDeactivateJob();
  app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
})();
