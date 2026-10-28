const fs = require("fs");
const path = require("path");

function walk(dir, list = []) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes(".git") && !full.includes(".vscode") && !full.includes("node_modules")) {
        walk(full, list);
      }
    } else if (file.endsWith(".html")) {
      list.push(full);
    }
  });
  return list;
}

const files = walk(".");
const samples = {};

files.forEach(f => {
  const content = fs.readFileSync(f, "utf8");
  if (!content.includes("<header")) return;
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
  if (headerMatch && headerMatch[0].includes("/category/running.html")) return;

  const match = content.match(/([ \t]*<li[^>]*>\s*<a\s+href="\/category\/puzzle\.html"[^>]*>[\s\S]*?<\/a>\s*<\/li>)/i);
  if (match) {
    const snippet = match[0];
    samples[snippet] = (samples[snippet] || 0) + 1;
  }
});

console.log("Snippet variations:", samples);

