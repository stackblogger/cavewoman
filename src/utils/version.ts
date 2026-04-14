import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function readVersion(): string {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const pkgPath = path.join(here, "..", "..", "package.json");
    const raw = fs.readFileSync(pkgPath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const defaultHomepage = "https://opensource.stackblogger.com/cavewoman/";

export function readHomepage(): string {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const pkgPath = path.join(here, "..", "..", "package.json");
    const raw = fs.readFileSync(pkgPath, "utf8");
    const parsed = JSON.parse(raw) as { homepage?: string };
    if (typeof parsed.homepage === "string" && parsed.homepage.trim()) {
      return parsed.homepage.trim();
    }
  } catch {
    /* ignore */
  }
  return defaultHomepage;
}
