/**
 * Standalone Agentation Bundle
 *
 * Self-contained build that bundles React internally and auto-mounts
 * the toolbar. Can be loaded via <script> tag on any webpage.
 *
 * Usage:
 *   <script src="https://unpkg.com/agentation/dist/standalone.js"></script>
 *
 * API:
 *   Agentation.mount()   - Mount the toolbar (auto-called on load)
 *   Agentation.unmount() - Remove the toolbar
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { PageFeedbackToolbarCSS } from "./components/page-toolbar-css";

let root: ReactDOM.Root | null = null;
let container: HTMLDivElement | null = null;

function mount() {
  if (root) return; // Already mounted

  container = document.createElement("div");
  container.id = "agentation-standalone-root";
  document.body.appendChild(container);

  root = ReactDOM.createRoot(container);
  root.render(React.createElement(PageFeedbackToolbarCSS));
}

function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
}

// Expose global API
const AgentationAPI = { mount, unmount };
(window as any).Agentation = AgentationAPI;

// Auto-mount when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}

export { mount, unmount };
