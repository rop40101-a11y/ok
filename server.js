// server.js (ES Module)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to built SPA
const DIST_DIR = path.join(__dirname, "dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");

// Optional: simple health-check for the host/platform
app.get("/_health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Serve static assets (from Vite build)
app.use(
  express.static(DIST_DIR, {
    // cache static assets for 1 day in browsers (adjust if needed)
    maxAge: "1d",
    // If you want to set extra headers, you can use setHeaders
    setHeaders: (res, filePath) => {
      // prevent indexing of source maps
      if (filePath.endsWith(".map")) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
      }
    },
  })
);

// If you have server-side API routes, define them BEFORE the SPA fallback.
// Example:
// app.get("/api/hello", (req, res) => res.json({ msg: "hello" }));

// SPA fallback for all GET requests that did not match static files or APIs.
// We only handle GET here so POST/PUT/DELETE for APIs are unaffected.
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  // If index.html doesn't exist, return 404
  if (!fs.existsSync(INDEX_FILE)) {
    return res.status(500).send("index.html not found — run `npm run build` first.");
  }

  res.sendFile(INDEX_FILE, (err) => {
    if (err) {
      // let Express handle the error
      next(err);
    }
  });
});

// Generic error handler (nice to have on hosting platforms)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  if (!res.headersSent) {
    res.status(500).send("Internal Server Error");
  } else {
    next(err);
  }
});

// Listen on the host assigned by the platform. Use 0.0.0.0 for containers.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT} (PORT=${PORT})`);
});
