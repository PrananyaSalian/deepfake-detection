// server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";

const app = express();

// -------------------------------
// Middleware
// -------------------------------
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

// -------------------------------
// Multer setup
// -------------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

// -------------------------------
// MongoDB
// -------------------------------
const MONGO_URI =
  "mongodb+srv://sprananya18824_db_user:prananya18s@cluster0.trno3ua.mongodb.net/deepfakeDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// -------------------------------
// User Schema
// -------------------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

const generateToken = (id) =>
  jwt.sign({ id }, "secretkey", { expiresIn: "30d" });

// -------------------------------
// REGISTER
// -------------------------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({
      message: "Registered successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering", error: err.message });
  }
});

// -------------------------------
// LOGIN
// -------------------------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// =====================================================
// 📹 VIDEO ANALYSIS — FIXED ✅
// =====================================================
app.post("/api/analyze", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No video uploaded" });

  const uploadsDir = path.resolve("uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const tempPath = path.join(
    uploadsDir,
    `${Date.now()}_${req.file.originalname}`
  );

  fs.writeFileSync(tempPath, req.file.buffer);

  const pythonScript = path.resolve(
    "A://Deepfake//deepfake detectors//predict_video.py"
  );

  const startTime = Date.now();

  execFile("python", [pythonScript, tempPath], (error, stdout, stderr) => {
    fs.unlink(tempPath, () => {});

    if (error) {
      return res.status(500).json({
        message: "Python execution failed",
        error: stderr || error.message,
      });
    }

    try {
      const raw = JSON.parse(stdout.trim());
      const elapsed = Date.now() - startTime;

      const fakeVotes = raw.fake_votes ?? 0;
      const realVotes = raw.real_votes ?? 0;
      const totalVotes = fakeVotes + realVotes || 1;

      const fakeRatio = fakeVotes / totalVotes;

      // ==========================================
      // 🚀 FRONTEND COMPATIBLE JSON RESPONSE
      // ==========================================
      res.json({
        result: raw.result, // "FAKE" or "REAL"
        confidence: Number(fakeRatio.toFixed(2)),
        real_votes: realVotes,
        fake_votes: fakeVotes,
        frames: raw.frames ?? 0,
        time_ms: elapsed,
      });
    } catch (e) {
      res.status(500).json({
        message: "Invalid Python JSON Output",
        output: stdout,
      });
    }
  });
});

// =====================================================
// 🖼️ IMAGE ANALYSIS — FIXED ✅
// =====================================================
app.post("/api/analyze-image", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No image uploaded" });

  const uploadsDir = path.resolve("uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const tempPath = path.join(
    uploadsDir,
    `${Date.now()}_${req.file.originalname}`
  );

  fs.writeFileSync(tempPath, req.file.buffer);

  const pythonScript = path.resolve("A:/Deep project/predict_image.py");

  const startTime = Date.now();

  execFile("python", [pythonScript, tempPath], (error, stdout, stderr) => {
    fs.unlink(tempPath, () => {});

    if (error) {
      return res.status(500).json({
        message: "Image analysis failed",
        error: stderr || error.message,
      });
    }

    try {
      const raw = JSON.parse(stdout.trim());
      const elapsed = Date.now() - startTime;

      const prob = raw.probability ?? 0;

      // ==========================================
      // 🚀 FRONTEND COMPATIBLE JSON RESPONSE
      // ==========================================
      res.json({
        result: raw.result,
        confidence: Number(prob.toFixed(4)),
        real_votes: 0,
        fake_votes: 0,
        frames: 1,
        time_ms: elapsed,
      });
    } catch (e) {
      res.status(500).json({
        message: "Invalid Python output",
        output: stdout,
      });
    }
  });
});

// -------------------------------
// HEALTH CHECK
// -------------------------------
app.get("/health", (req, res) => res.json({ status: "ok" }));

// -------------------------------
// START SERVER
// -------------------------------
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
