// scripts/start-with-worker.js
import { spawn } from "node:child_process";

const env = {
  ...process.env,
  NODE_ENV: "production",
  HOST: "0.0.0.0",
  PORT: process.env.PORT || "8080",
};

function run(cmd, args, name) {
  const p = spawn(cmd, args, { stdio: "inherit", env });
  p.on("exit", (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });
  return p;
}

// 1) Web server (ana proses)
run("npm", ["run", "start"], "web");

// 2) Worker (arka plan) - crash ederse web yaşamaya devam eder
run("node", ["app/worker/seo.worker.js"], "worker");