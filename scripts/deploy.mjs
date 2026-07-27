// Baut die Seite mit dem GitHub-Pages-Unterpfad und pusht sie auf den gh-pages-Branch.
// Aufruf: npm run deploy
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const run = (cmd) =>
  execSync(cmd, { stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/agentur" } });

run("npx next build");
// Ohne .nojekyll würde GitHub Pages den _next/-Ordner (Unterstrich!) ignorieren
writeFileSync("out/.nojekyll", "");
run('npx gh-pages -d out --dotfiles -m "Deploy zur GitHub Pages"');
console.log("\nLive unter: https://bilal-altu.github.io/agentur/");
