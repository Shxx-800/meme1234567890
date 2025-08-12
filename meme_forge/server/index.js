import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { uploadToR2, getSignedUploadUrl } from "./config/cloudflare.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --------------------- MULTER SETUP FOR IMAGE UPLOAD (OPTIONAL) ---------------------
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// --------------------- HEALTH CHECK ---------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// --------------------- CLOUDFLARE R2 UPLOAD ---------------------
app.post("/upload-meme", upload.single('meme'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const fileName = `meme-${Date.now()}.${req.file.originalname.split('.').pop()}`;
    
    const publicUrl = await uploadToR2(buffer, fileName, req.file.mimetype);
    
    // Clean up temporary file
    fs.unlinkSync(req.file.path);
    
    res.json({ 
      success: true, 
      url: publicUrl,
      message: "Meme uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading meme:", error);
    res.status(500).json({ error: "Failed to upload meme" });
  }
});

// --------------------- GET SIGNED UPLOAD URL ---------------------
app.post("/get-upload-url", async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    
    if (!fileName) {
      return res.status(400).json({ error: "fileName is required" });
    }
    
    const result = await getSignedUploadUrl(fileName, contentType);
    res.json(result);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// --------------------- IMAGE GENERATION (AI) ---------------------
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Check if HF_API_KEY is configured
    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ 
        error: "AI image generation not configured. Please set HF_API_KEY in environment variables." 
      });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Optionally upload generated image to R2
    try {
      const fileName = `ai-generated-${Date.now()}.png`;
      const publicUrl = await uploadToR2(Buffer.from(buffer), fileName, 'image/png');
      
      res.json({ 
        image: imageUrl, // Base64 for immediate use
        cloudUrl: publicUrl, // R2 URL for permanent storage
        prompt: prompt
      });
    } catch (uploadError) {
      console.warn("Failed to upload to R2, returning base64 only:", uploadError);
      res.json({ image: imageUrl, prompt: prompt });
    }
  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// --------------------- START SERVER ---------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/upload-meme`);
  console.log(`🤖 AI generation: http://localhost:${PORT}/generate-image`);
  
  // Check environment variables
  if (!process.env.HF_API_KEY) {
    console.warn("⚠️  HF_API_KEY not set - AI generation will not work");
  }
  if (!process.env.CLOUDFLARE_R2_ENDPOINT) {
    console.warn("⚠️  Cloudflare R2 not configured - uploads will not work");
  }
});
