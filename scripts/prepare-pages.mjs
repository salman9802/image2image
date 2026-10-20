import { cp, rm, writeFile } from "node:fs/promises";

// remove exisiting `docs/`
await rm("docs", { recursive: true, force: true });
// copy `out/` to `docs/`
await cp("out", "docs", { recursive: true });
// empty `.nojekyll` file in `docs/`
await writeFile("docs/.nojekyll", "");

console.log("========== Static site prepared in docs/ ==========\n");

