import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export function loadEnv() {
  // Robustly load .env from several likely locations so Prisma finds DATABASE_URL.
  // This covers different runtime layouts (ts-node, compiled dist, running from repo root, etc.).
  const candidates = [
    path.join(__dirname, '../../../.env'), // compiled JS -> three levels up to repo root
    path.join(__dirname, '../../.env'),
    path.resolve(process.cwd(), '.env'), // running from service folder
    path.resolve(process.cwd(), '../.env'), // running from repo root and cwd is apps/products-xstore-ms
    path.resolve(process.cwd(), '../../.env'),
  ];

  let loadedPath: string | null = null;
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const result = dotenv.config({ path: p });
        if (result.error) {
          // continue trying others
          continue;
        }
        loadedPath = p;
        break;
      }
    } catch {
      // ignore and continue
    }
  }

  if (!loadedPath) {
    // Last resort: try default dotenv behavior (look in cwd)
    const result = dotenv.config();
    if (!result.error) {
      loadedPath = path.resolve(process.cwd(), '.env');
    }
  }

  console.log('[env] loaded .env from:', loadedPath ?? 'none');
  console.log(
    '[env] DATABASE_URL present:',
    typeof process.env.DATABASE_URL === 'string',
  );
}
