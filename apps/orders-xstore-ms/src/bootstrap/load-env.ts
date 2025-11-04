import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

export function loadEnv() {
  // Load .env from the root of the monorepo
  const candidates = [
    path.join(__dirname, "../../../.env"), // compiled JS -> three levels up to repo root
    path.join(__dirname, "../../.env"),
    path.resolve(process.cwd(), ".env"), // running from service folder
    path.resolve(process.cwd(), "../.env"), // running from repo root
    path.resolve(process.cwd(), "../../.env"),
  ];

  let loadedPath: string | null = null;
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const result = dotenv.config({ path: p });
        if (result.error) {
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
    const result = dotenv.config();
    if (!result.error) {
      loadedPath = path.resolve(process.cwd(), ".env");
    }
  }

  console.log("[env] loaded .env from:", loadedPath ?? "none");
}
