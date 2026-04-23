// Preview dev launcher — sets a separate distDir so it can run alongside
// the primary `next dev` without colliding on the lockfile.
const { spawn } = require("child_process");
const path = require("path");

process.env.NEXT_DIST_DIR = ".next-preview";

const projectRoot = path.resolve(__dirname, "..");
const nextBin = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

const child = spawn(
  process.execPath,
  [nextBin, "dev", "--port", "3456"],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
