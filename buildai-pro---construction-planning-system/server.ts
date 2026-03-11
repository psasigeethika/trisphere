import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("construction.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    inputs TEXT,
    plan TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Calculate and Save Project
  app.post("/api/projects", async (req, res) => {
    try {
      const inputs = req.body;
      const { plotArea, unit, floors, buildingType, dailyWage, costPerSqUnit } = inputs;

      // Convert to sq yards for standard thumb rules if needed
      const areaInSqYards = unit === 'sqft' ? plotArea / 9 : plotArea;
      const floorCount = floors;

      // Deterministic Thumb Rules (Civil Engineering Standards)
      const steelPerSqYard = buildingType === 'Commercial' ? 4.5 : 3.5; // kg
      const cementPerSqYard = 0.45; // bags
      const sandPerSqYard = 0.65; // tons
      const bricksPerSqYard = 500; // units
      const aggregatesPerSqYard = 0.5; // tons
      const waterPerSqYard = 600; // liters

      const totalSteel = (areaInSqYards * floorCount * steelPerSqYard) / 1000; // tons
      const totalCement = Math.ceil(areaInSqYards * floorCount * cementPerSqYard);
      const totalSand = areaInSqYards * floorCount * sandPerSqYard;
      const totalBricks = Math.ceil(areaInSqYards * floorCount * bricksPerSqYard);
      const totalAggregates = areaInSqYards * floorCount * aggregatesPerSqYard;
      const totalWater = areaInSqYards * floorCount * waterPerSqYard;

      const materialCost = areaInSqYards * floorCount * costPerSqUnit;
      const laborCost = materialCost * 0.35; // 35% labor cost
      const overhead = (materialCost + laborCost) * 0.12; // 12% overhead
      const totalCost = materialCost + laborCost + overhead;

      const totalLabourDays = Math.ceil(areaInSqYards * 0.6) * floorCount;
      const workersPerDay = Math.ceil(areaInSqYards / 120) * floorCount + 2;
      
      // Calculate workforce with consistent totals
      const masons = Math.ceil(workersPerDay * 0.3);
      const helpers = Math.ceil(workersPerDay * 0.35);
      const carpenters = Math.ceil(workersPerDay * 0.1);
      const steelWorkers = Math.ceil(workersPerDay * 0.1);
      const electricians = Math.ceil(workersPerDay * 0.08);
      const plumbers = Math.ceil(workersPerDay * 0.07);
      
      // The sum might still be slightly off due to ceil, but we'll use workersPerDay as the target
      // and adjust the largest category (helpers) if needed, or just report the actual sum as the total.
      const actualTotal = masons + helpers + carpenters + steelWorkers + electricians + plumbers;

      const workforce = {
        masons,
        helpers,
        carpenters,
        steelWorkers,
        electricians,
        plumbers,
        totalLabourDays
      };

      const metrics = {
        totalCost,
        laborCost,
        materialCost,
        overhead,
        totalWorkers: actualTotal,
        totalLabourDays,
        durationDays: totalLabourDays / actualTotal
      };

      const materials = {
        steel: totalSteel,
        cement: totalCement,
        sand: totalSand,
        water: totalWater,
        bricks: totalBricks,
        aggregates: totalAggregates
      };

      const partialPlan = {
        inputs,
        metrics,
        workforce,
        materials
      };

      res.json({ success: true, data: partialPlan });
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({ success: false, error: "Failed to process project" });
    }
  });

  // API: Save Final Plan (with AI data)
  app.post("/api/projects/save", (req, res) => {
    try {
      const { inputs, plan } = req.body;
      const stmt = db.prepare("INSERT INTO projects (inputs, plan) VALUES (?, ?)");
      const result = stmt.run(JSON.stringify(inputs), JSON.stringify(plan));
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Get History
  app.get("/api/projects", (req, res) => {
    try {
      const projects = db.prepare("SELECT * FROM projects ORDER BY timestamp DESC").all();
      res.json({
        success: true,
        data: projects.map(p => ({
          id: p.id,
          timestamp: p.timestamp,
          inputs: JSON.parse(p.inputs),
          plan: JSON.parse(p.plan)
        }))
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
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
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
