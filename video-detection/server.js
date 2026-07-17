// backend/server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());

// ✅ Allow frontend (8080 or 8081)
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:8081", // added this
      "http://127.0.0.1:8081"  // added this
    ],
    credentials: true,
  })
);

// ✅ Multer setup for video uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "./uploads";
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

// ✅ MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://sprananya18824_db_user:prananya18s@cluster0.trno3ua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

const generateToken = (id) =>
  jwt.sign({ id }, "secretkey", { expiresIn: "30d" });

// ✅ Register API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.json({
      message: "Registered successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering", error: err.message });
  }
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// ✅ Analyze Video (Deepfake Detection)
app.post("/api/analyze", upload.single("media"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No video uploaded" });

    const videoPath = path.resolve(req.file.path);
    const pythonScript = path.resolve("./predict_video.py"); // Same folder

    console.log("🎬 Running Deepfake Detection on:", videoPath);

    const py = spawn("python", [pythonScript, videoPath]);

    let dataString = "";
    py.stdout.on("data", (data) => (dataString += data.toString()));
    py.stderr.on("data", (err) =>
      console.error("🐍 Python Error:", err.toString())
    );

    py.on("close", () => {
      try {
        const result = JSON.parse(dataString);
        res.json({ filename: req.file.originalname, result });
      } catch {
        console.error("❌ Failed to parse Python output:", dataString);
        res
          .status(500)
          .json({ message: "Failed to parse Python response", output: dataString });
      }

      // Cleanup
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    });
  } catch (err) {
    res.status(500).json({ message: "Error analyzing video", error: err.message });
  }
});

// ✅ Health Check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
