import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

// Import modular backend logic
import { analyzeInnovation } from "./analyzer";
import { searchPriorArt } from "./prior_art";
import { generateClaims } from "./claims";
import { generatePatent } from "./patent_generator";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    try {
      const { description } = req.body;
      const result = await analyzeInnovation(description);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  app.post("/api/prior-art", async (req, res) => {
    try {
      const { description } = req.body;
      const result = await searchPriorArt(description);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Prior art search failed" });
    }
  });

  app.post("/api/generate-claims", async (req, res) => {
    try {
      const { description, analysis } = req.body;
      const result = await generateClaims(description, analysis);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Claims generation failed" });
    }
  });

  app.post("/api/generate-patent", async (req, res) => {
    try {
      const { description, analysis, claims } = req.body;
      const result = await generatePatent(description, analysis, claims);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Patent generation failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
