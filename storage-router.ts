/**
 * Storage Router for tRPC
 * Handles audio file uploads to S3 storage
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

export const storageRouter = router({
  /**
   * Upload audio file to S3 storage
   * Input: base64-encoded file data
   * Output: public URL for the uploaded file
   */
  uploadAudio: publicProcedure
    .input(
      z.object({
        fileName: z.string().default("recording.m4a"),
        fileData: z.string(), // base64-encoded file data
        contentType: z.string().default("audio/m4a"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("[Storage] 📤 Uploading audio file");
        console.log("[Storage] 📁 File name:", input.fileName);
        console.log("[Storage] 📊 File size:", input.fileData.length, "bytes (base64)");
        console.log("[Storage] 🎵 Content type:", input.contentType);

        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");
        console.log("[Storage] ✓ Converted base64 to buffer:", buffer.length, "bytes");

        // Upload to S3
        console.log("[Storage] 🌐 Uploading to S3...");
        const result = await storagePut(
          `audio/${Date.now()}_${input.fileName}`,
          buffer,
          input.contentType
        );

        console.log("[Storage] ✅ Upload successful");
        console.log("[Storage] 🔗 Storage key:", result.key);
        console.log("[Storage] 🔗 Public URL:", result.url);

        return {
          key: result.key,
          url: result.url,
        };
      } catch (error) {
        console.error("[Storage] ❌ Upload failed:", error);
        throw new Error(
          `Failed to upload audio: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),
});
