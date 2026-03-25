import { spawn } from "node:child_process";

function run(cmd, args, opts = {}) {
  const p = spawn(cmd, args, { stdio: "inherit", ...opts });
  return p;
}

// 1) Web her zaman ayağa kalksın (Cloud Run PORT dinlesin)
const web = run("npm", ["run", "start"]);

// 2) Worker arka planda çalışsın; crash olursa sadece logla
const worker = run("npm", ["run", "worker"]);
worker.on("exit", (code) => {
  console.error(`[worker] exited with code ${code} (web continues)`);
});

// Web düşerse container kapanabilir (normal)
web.on("exit", (code) => {
  console.error(`[web] exited with code ${code}`);
  process.exit(code ?? 1);
});