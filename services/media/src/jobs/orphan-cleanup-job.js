import cron from 'node-cron';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';
const AUTH_URL = process.env.AUTH_URL || 'http://auth:3001';
const CATALOG_URL = process.env.CATALOG_URL || 'http://catalog:3002';
const SERVICE_SECRET = process.env.SERVICE_SECRET;

/**
 * Fetches all avatar URLs from the auth service
 * @returns {Promise<Set<string>>} Set of avatar filenames
 */
async function fetchAvatars() {
  try {
    const response = await fetch(`${AUTH_URL}/internal/avatars`, {
      headers: { 'X-Service-Secret': SERVICE_SECRET },
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`Auth service returned ${response.status}`);
    }

    const data = await response.json();
    return new Set(data.avatars || []);
  } catch (error) {
    console.error('[OrphanCleanup] Failed to fetch avatars:', error.message);
    throw error;
  }
}

/**
 * Fetches all photo paths from the catalog service
 * @returns {Promise<Set<string>>} Set of photo filenames
 */
async function fetchPhotos() {
  try {
    const response = await fetch(`${CATALOG_URL}/internal/photos`, {
      headers: { 'X-Service-Secret': SERVICE_SECRET },
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`Catalog service returned ${response.status}`);
    }

    const data = await response.json();
    return new Set(data.photos || []);
  } catch (error) {
    console.error('[OrphanCleanup] Failed to fetch photos:', error.message);
    throw error;
  }
}

/**
 * Gets all files currently on disk
 * @returns {Promise<string[]>} Array of filenames
 */
async function getFilesOnDisk() {
  try {
    const files = await readdir(UPLOAD_DIR);
    // Filter only webp files (ignore any non-image files)
    return files.filter(file => file.endsWith('.webp'));
  } catch (error) {
    console.error('[OrphanCleanup] Failed to read upload directory:', error.message);
    throw error;
  }
}

/**
 * Deletes orphan files from disk
 * @param {string[]} orphans - Array of orphan filenames
 * @returns {Promise<{deleted: number, errors: number}>}
 */
async function deleteOrphans(orphans) {
  let deleted = 0;
  let errors = 0;

  for (const filename of orphans) {
    try {
      const filepath = path.join(UPLOAD_DIR, filename);
      await unlink(filepath);
      console.log(`[OrphanCleanup] Deleted: ${filename}`);
      deleted++;
    } catch (error) {
      console.error(`[OrphanCleanup] Failed to delete ${filename}:`, error.message);
      errors++;
    }
  }

  return { deleted, errors };
}

/**
 * Main cleanup job function
 */
async function runCleanup() {
  const startTime = new Date().toISOString();
  console.log(`[OrphanCleanup] Starting daily cleanup job at ${startTime}`);

  try {
    // Get all data in parallel
    const [filesOnDisk, avatars, photos] = await Promise.all([
      getFilesOnDisk(),
      fetchAvatars(),
      fetchPhotos()
    ]);

    console.log(`[OrphanCleanup] Files on disk: ${filesOnDisk.length}`);
    console.log(`[OrphanCleanup] Avatars in use: ${avatars.size}`);
    console.log(`[OrphanCleanup] Photos in use: ${photos.size}`);

    // Combine all referenced files
    const referencedFiles = new Set([...avatars, ...photos]);

    // Find orphans: files on disk that are not referenced
    const orphans = filesOnDisk.filter(file => !referencedFiles.has(file));
    console.log(`[OrphanCleanup] Orphan files found: ${orphans.length}`);

    if (orphans.length === 0) {
      console.log('[OrphanCleanup] No orphans to clean. Job completed.');
      return;
    }

    // Delete orphans
    const { deleted, errors } = await deleteOrphans(orphans);

    console.log(`[OrphanCleanup] Job completed: ${deleted} orphans removed, ${errors} errors`);

  } catch (error) {
    console.error('[OrphanCleanup] Job failed:', error.message);
    console.error('[OrphanCleanup] No files were deleted due to error');
  }
}

/**
 * Validates cron expression
 */
function isValidCron(expression) {
  return cron.validate(expression);
}

/**
 * Initializes the orphan cleanup cron job
 * Runs daily at 3:00 AM Madrid time (CET/CEST)
 */
export function initOrphanCleanupJob() {
  // Daily at 3:00 AM - Madrid timezone
  const schedule = '0 3 * * *';

  if (!isValidCron(schedule)) {
    console.error('[OrphanCleanup] Invalid cron expression:', schedule);
    return;
  }

  // Schedule the job with Madrid timezone
  cron.schedule(
    schedule,
    runCleanup,
    {
      scheduled: true,
      timezone: 'Europe/Madrid',
      name: 'orphan-cleanup'
    }
  );

  console.log('[OrphanCleanup] Scheduled job: daily at 3:00 AM (Europe/Madrid)');
  console.log(`[OrphanCleanup] Upload directory: ${UPLOAD_DIR}`);
  console.log(`[OrphanCleanup] Auth URL: ${AUTH_URL}`);
  console.log(`[OrphanCleanup] Catalog URL: ${CATALOG_URL}`);
}

export default { initOrphanCleanupJob };
