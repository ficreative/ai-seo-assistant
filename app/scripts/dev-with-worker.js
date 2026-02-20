// scripts/dev-with-worker.js
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

function cmd(name) {
  if (process.platform === "win32") return `${name}.cmd`;
  return name;
}

const root = process.cwd();
const workerCandidates = ["app/worker/seo.worker.js", "worker/seo.worker.js"];
const workerRel = workerCandidates.find((p) => fs.existsSync(path.join(root, p)));

if (!workerRel) {
  console.error(
    "[dev-with-worker] Worker file not found. Looked for:",
    workerCandidates.join(", "),
  );
  process.exit(1);
}

console.log("[dev-with-worker] Starting Shopify dev server + worker:", workerRel);

const web = spawn(cmd("shopify"), ["app", "dev"], {
  stdio: "inherit",
  env: process.env,
});

const worker = spawn(process.execPath, [workerRel], {
  stdio: "inherit",
  env: process.env,
});

function shutdown(code = 0) {
  try { worker.kill("SIGINT"); } catch {}
  try { web.kill("SIGINT"); } catch {}
  process.exit(code);
}

web.on("exit", (code) => shutdown(code ?? 0));
worker.on("exit", (code) => shutdown(code ?? 0));

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
