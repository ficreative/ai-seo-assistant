// scripts/start-with-worker.js
import { spawn } from "node:child_process";

function run(cmd, args) {
  const p = spawn(cmd, args, { stdio: "inherit", shell: true });
  p.on("exit", (code) => process.exit(code ?? 0));
  return p;
}

run("npm", ["run", "start"]);   // web
run("npm", ["run", "worker"]);  // worker