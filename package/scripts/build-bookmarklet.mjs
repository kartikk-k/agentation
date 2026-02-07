/**
 * Post-build script for standalone bundle artifacts.
 * Generates bookmarklet.html, bookmarklet.txt, and test-standalone.html
 * from the built standalone.js bundle.
 *
 * Run via: pnpm build:bookmarklet
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

// Read the built standalone bundle
const standaloneJs = readFileSync(resolve(distDir, "standalone.js"), "utf-8");
const bundleSizeKB = Math.round(standaloneJs.length / 1024);

// Read version from package.json
const pkg = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf-8"));
const version = pkg.version;

// --- bookmarklet.txt ---
// The bookmarklet injects the standalone script from unpkg CDN
const bookmarkletCode = `javascript:void(function(){if(window.Agentation){window.Agentation.unmount();delete window.Agentation;return}var s=document.createElement('script');s.src='https://unpkg.com/agentation@${version}/dist/standalone.js';document.head.appendChild(s)})()`;
writeFileSync(resolve(distDir, "bookmarklet.txt"), bookmarkletCode, "utf-8");

// --- bookmarklet.html ---
const bookmarkletHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agentation Bookmarklet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 640px;
      padding: 48px 24px;
      text-align: center;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    .version {
      font-size: 14px;
      color: #888;
      margin-bottom: 32px;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #a3a3a3;
      margin-bottom: 24px;
    }
    .bookmarklet-link {
      display: inline-block;
      padding: 14px 32px;
      background: #3c82f7;
      color: #fff;
      text-decoration: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: grab;
      transition: background 0.15s;
      margin-bottom: 16px;
    }
    .bookmarklet-link:hover { background: #2563eb; }
    .hint {
      font-size: 13px;
      color: #666;
      margin-bottom: 40px;
    }
    .section {
      text-align: left;
      background: #171717;
      border: 1px solid #262626;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .section h2 {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 12px;
    }
    .section p { font-size: 14px; margin-bottom: 12px; }
    code {
      background: #262626;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
      color: #e5e5e5;
    }
    pre {
      background: #0a0a0a;
      border: 1px solid #262626;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.5;
      color: #a3a3a3;
    }
    .stats {
      display: flex;
      gap: 24px;
      justify-content: center;
      margin-bottom: 32px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Agentation</h1>
    <p class="version">v${version}</p>
    <p>Annotate any webpage with a single click. Drag the button below to your bookmarks bar to install.</p>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">~${bundleSizeKB}KB</div>
        <div class="stat-label">Bundle size</div>
      </div>
      <div class="stat">
        <div class="stat-value">0</div>
        <div class="stat-label">Dependencies</div>
      </div>
    </div>

    <a class="bookmarklet-link" href="${bookmarkletCode}">Agentation</a>
    <p class="hint">Drag this button to your bookmarks bar. Click it on any page to toggle the toolbar.</p>

    <div class="section">
      <h2>Script Tag</h2>
      <p>Add this to any HTML page:</p>
      <pre>&lt;script src="https://unpkg.com/agentation@${version}/dist/standalone.js"&gt;&lt;/script&gt;</pre>
    </div>

    <div class="section">
      <h2>Console</h2>
      <p>Paste this in your browser DevTools console:</p>
      <pre>var s=document.createElement('script');s.src='https://unpkg.com/agentation@${version}/dist/standalone.js';document.head.appendChild(s);</pre>
    </div>

    <div class="section">
      <h2>API</h2>
      <p>Once loaded, the <code>Agentation</code> global is available:</p>
      <pre>Agentation.mount()    // Mount the toolbar
Agentation.unmount()  // Remove the toolbar</pre>
    </div>
  </div>
</body>
</html>`;

writeFileSync(resolve(distDir, "bookmarklet.html"), bookmarkletHtml, "utf-8");

// --- test-standalone.html ---
const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agentation Standalone Test</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fafafa;
      color: #1a1a1a;
      padding: 48px 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 32px; margin-bottom: 8px; }
    .subtitle { color: #666; margin-bottom: 32px; }
    .card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 16px;
    }
    .card h2 { font-size: 18px; margin-bottom: 8px; }
    .card p { color: #555; line-height: 1.6; }
    button {
      padding: 10px 20px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
      margin: 4px;
    }
    button:hover { background: #f5f5f5; }
    .controls { margin: 24px 0; }
    .hero {
      background: linear-gradient(135deg, #3c82f7, #8b5cf6);
      color: white;
      padding: 48px 32px;
      border-radius: 16px;
      margin-bottom: 24px;
      text-align: center;
    }
    .hero h2 { font-size: 24px; margin-bottom: 8px; }
    .hero p { opacity: 0.9; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    a { color: #3c82f7; }
    img { max-width: 100%; border-radius: 8px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; color: #555; }
  </style>
</head>
<body>
  <h1>Standalone Test Page</h1>
  <p class="subtitle">This page tests the standalone Agentation bundle. The toolbar should appear in the bottom-right corner.</p>

  <div class="controls">
    <button onclick="Agentation.unmount()">Unmount Toolbar</button>
    <button onclick="Agentation.mount()">Mount Toolbar</button>
  </div>

  <div class="hero">
    <h2>Try annotating this section</h2>
    <p>Click the toolbar, then click any element on this page to create an annotation.</p>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Feature One</h2>
      <p>Click to annotate individual elements. Each annotation captures the element's CSS selector, text content, and position.</p>
    </div>
    <div class="card">
      <h2>Feature Two</h2>
      <p>Drag to select multiple elements at once. Useful for annotating groups of related content.</p>
    </div>
    <div class="card">
      <h2>Feature Three</h2>
      <p>Copy all annotations as structured markdown. Share feedback with developers or designers.</p>
    </div>
    <div class="card">
      <h2>Feature Four</h2>
      <p>Annotations persist in localStorage. Come back later and your annotations are still here.</p>
    </div>
  </div>

  <div class="card">
    <h2>Sample Content</h2>
    <p>This is a paragraph of sample content for testing annotations. It contains <a href="#">a link</a>, <strong>bold text</strong>, and <em>italic text</em>.</p>
    <ul>
      <li>List item one</li>
      <li>List item two</li>
      <li>List item three</li>
    </ul>
  </div>

  <script src="./standalone.js"></script>
</body>
</html>`;

writeFileSync(resolve(distDir, "test-standalone.html"), testHtml, "utf-8");

console.log(`Bookmarklet artifacts generated:`);
console.log(`  dist/standalone.js      (${bundleSizeKB}KB)`);
console.log(`  dist/bookmarklet.html`);
console.log(`  dist/bookmarklet.txt`);
console.log(`  dist/test-standalone.html`);
