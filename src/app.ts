import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import router  from "../src/routes/routes"
import prisma from "./config/db";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get('/test-db', async (_req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }
});


app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.use("/api", router);

export default app;
