#!/usr/bin/env node
import { spawn, execSync } from "node:child_process";

function spawnProc(name, cmd, args) {
  const p = spawn(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  p.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[dev-with-worker] ${name} exited with signal ${signal}`);
    } else {
      console.log(`[dev-with-worker] ${name} exited with code ${code}`);
    }
    // If either exits, shut down the other.
    shutdown(code ?? 0);
  });
  return p;
}

let shuttingDown = false;
let procs = [];

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const p of procs) {
    try {
      if (!p.killed) p.kill("SIGTERM");
    } catch {}
  }
  // Give a moment then hard kill if needed
  setTimeout(() => {
    for (const p of procs) {
      try {
        if (!p.killed) p.kill("SIGKILL");
      } catch {}
    }
    process.exit(code);
  }, 1500);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

// Ensure DB schema is up to date before starting dev.
// We use `db push` here because it's non-interactive and avoids migration drift
// during local development when switching branches / zip versions.
try {
  console.log("[dev-with-worker] Ensuring Prisma client + DB schema...");
  execSync("npx prisma generate", { stdio: "inherit" });
  execSync("npx prisma db push", { stdio: "inherit" });
} catch (e) {
  console.error("[dev-with-worker] Prisma setup failed. Fix the error above and re-run.");
  process.exit(1);
}

console.log("[dev-with-worker] Starting web (shopify app dev) + worker...");
const web = spawnProc("web", "shopify", ["app", "dev"]);
const worker = spawnProc("worker", "npm", ["run", "worker"]);
procs = [web, worker];
