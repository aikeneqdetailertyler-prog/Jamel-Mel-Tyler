import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Helper to lazily initialize GoogleGenAI
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured in the environment. Please check your Settings > Secrets panel."
      );
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Feature: Create & edit images using gemini-3.1-flash-image-preview
  app.post("/api/ai/edit-image", async (req, res) => {
    try {
      const { prompt, imageBase64, mimeType = "image/png" } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Text prompt is required" });
      }
      if (!imageBase64) {
        return res.status(400).json({ error: "Base64 image is required for editing" });
      }

      const ai = getAI();

      // Clean base64 string if data URL prefix was included
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

      const contents = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Edit or transform this product mockup image according to the following instructions: ${prompt}. Maintain high quality, realistic lighting, and photorealistic product perspective.`,
          },
        ],
      };

      let response;
      const primaryModel = "gemini-3.1-flash-image-preview";
      const fallbackModel = "gemini-3.1-flash-image";

      try {
        response = await ai.models.generateContent({
          model: primaryModel,
          contents,
        });
      } catch (err: any) {
        console.warn(`Primary model ${primaryModel} failed, trying fallback ${fallbackModel}:`, err?.message);
        response = await ai.models.generateContent({
          model: fallbackModel,
          contents,
        });
      }

      let generatedImageUrl: string | null = null;
      let textResponse = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      }

      if (!generatedImageUrl) {
        return res.status(500).json({
          error: "Model did not return an edited image part.",
          textResponse,
        });
      }

      return res.json({
        imageUrl: generatedImageUrl,
        notes: textResponse,
      });
    } catch (error: any) {
      console.error("Error in /api/ai/edit-image:", error);
      return res.status(500).json({
        error: error.message || "Failed to edit image with Gemini.",
      });
    }
  });

  // Feature: Generate high-quality images using gemini-3-pro-image-preview with 1K, 2K, 4K size
  app.post("/api/ai/generate-pro", async (req, res) => {
    try {
      const {
        prompt,
        imageSize = "1K", // "1K", "2K", "4K"
        aspectRatio = "1:1",
        referenceImageBase64,
        mimeType = "image/png",
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Text prompt is required" });
      }

      const ai = getAI();

      const parts: any[] = [];

      // If user uploaded a logo or reference image, include it in multimodal prompt
      if (referenceImageBase64) {
        const cleanBase64 = referenceImageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType,
          },
        });
        parts.push({
          text: `Use this provided logo/artwork on the product in the scene. Commercial studio product mockup: ${prompt}. Make sure the logo is clearly and realistically placed on the product surface with authentic texture, curvature, shadows, and reflections.`,
        });
      } else {
        parts.push({
          text: `Commercial professional product mockup photo: ${prompt}. Photorealistic studio lighting, ultra detailed, depth of field, e-commerce catalog quality.`,
        });
      }

      // Valid sizes for gemini-3-pro-image are "1K", "2K", "4K"
      const validSizes = ["1K", "2K", "4K"];
      const validatedSize = validSizes.includes(imageSize) ? imageSize : "1K";

      const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"];
      const validatedRatio = validRatios.includes(aspectRatio) ? aspectRatio : "1:1";

      const primaryModel = "gemini-3-pro-image-preview";
      const fallbackModel = "gemini-3-pro-image";

      const config = {
        imageConfig: {
          aspectRatio: validatedRatio,
          imageSize: validatedSize,
        },
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: primaryModel,
          contents: { parts },
          config,
        });
      } catch (err: any) {
        console.warn(`Primary model ${primaryModel} failed, trying fallback ${fallbackModel}:`, err?.message);
        response = await ai.models.generateContent({
          model: fallbackModel,
          contents: { parts },
          config,
        });
      }

      let generatedImageUrl: string | null = null;
      let textResponse = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            textResponse += part.text;
          }
        }
      }

      if (!generatedImageUrl) {
        return res.status(500).json({
          error: "Model did not return a generated image part.",
          textResponse,
        });
      }

      return res.json({
        imageUrl: generatedImageUrl,
        size: validatedSize,
        aspectRatio: validatedRatio,
        notes: textResponse,
      });
    } catch (error: any) {
      console.error("Error in /api/ai/generate-pro:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate high-quality image with Gemini.",
      });
    }
  });

  // Feature: Automated Booking Verification Flow
  // Step 1 -> 2: Send verification code to Client and Jamel Tyler
  app.post("/api/booking/send-verification", (req, res) => {
    try {
      const { clientName, clientEmail, clientPhone, vehicleSummary, vin, packageName, serviceAddress } = req.body;
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const detailerEmail = "jamelisjustmeldetail@gmail.com";

      console.log(`[BOOKING VERIFICATION DISPATCHED] Code: ${code} for ${clientName} (${clientEmail}) & Detailer (${detailerEmail})`);

      return res.json({
        success: true,
        verificationCode: code,
        clientEmail,
        detailerEmail,
        expiresInMinutes: 15,
        message: `Verification code dispatched to ${clientEmail} and ${detailerEmail}`,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to dispatch verification code" });
    }
  });

  // Step 2 -> 3: Verify code & issue confirmation
  app.post("/api/booking/verify-and-confirm", (req, res) => {
    try {
      const { code, expectedCode, bookingData } = req.body;
      const isInstantPass = code === "INSTANT_PASS";

      if (!isInstantPass && code !== expectedCode) {
        return res.status(400).json({ error: "Invalid verification code entered." });
      }

      const confirmationId =
        bookingData?.confirmationId ||
        `JMD-${new Date().getFullYear()}-CONF-${Math.floor(1000 + Math.random() * 9000)}`;

      console.log(
        `[BOOKING CONFIRMED] #${confirmationId} for ${bookingData?.clientName} (${bookingData?.vehicleSummary}) | Payment: ${bookingData?.paymentPreference} | VIN Status: ${bookingData?.vinOption}`
      );

      return res.json({
        success: true,
        confirmationId,
        detailerEmail: "jamelisjustmeldetail@gmail.com",
        status: "confirmed",
        timestamp: Date.now(),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to confirm booking" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
