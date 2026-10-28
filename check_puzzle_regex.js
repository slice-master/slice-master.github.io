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
let matchedCount = 0;
let unmatchedFiles = [];

// Check pattern: <li[^>]*>\s*<a\s+href="\/category\/puzzle\.html"[^>]*>[\s\S]*?<\/a>\s*<\/li>
const puzzleRegex = /(<li[^>]*>\s*<a\s+href="\/category\/puzzle\.html"[^>]*>[\s\S]*?<\/a>\s*<\/li>)/i;

files.forEach(f => {
  const content = fs.readFileSync(f, "utf8");
  if (!content.includes("<header")) return;
  if (content.includes("<header") && content.includes("/category/running.html")) {
    // Check if running is inside <header>...</header>
    const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
    if (headerMatch && headerMatch[0].includes("/category/running.html")) {
      return; // already has running in header
    }
  }

  if (puzzleRegex.test(content)) {
    matchedCount++;
  } else {
    unmatchedFiles.push(f);
  }
});

console.log("Matched with puzzle regex:", matchedCount);
console.log("Unmatched files:", unmatchedFiles);

