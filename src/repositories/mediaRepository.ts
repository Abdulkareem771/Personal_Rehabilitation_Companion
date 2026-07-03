// ─────────────────────────────────────────────────────────────────────────────
// Media Repository — Blob storage for images, GIFs, and progress photos
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid, nowISO } from "@/lib/utils";
import type { MediaAsset, MediaType } from "@/types";

const IMAGE_QUALITY = 0.85;
const MAX_IMAGE_DIMENSION = 1920;

export const mediaRepository = {
  async store(file: File, tags: string[] = [], exerciseIds: string[] = []): Promise<MediaAsset> {
    const type = inferMediaType(file);
    let blob: Blob = file;

    // Compress images before storage to prevent IndexedDB bloat
    if (type === "image" && file.type.startsWith("image/")) {
      blob = await compressImage(file, MAX_IMAGE_DIMENSION, IMAGE_QUALITY);
    }

    const asset: MediaAsset = {
      id: uid(),
      type,
      filename: file.name,
      blob,
      tags,
      exerciseIds,
      createdAt: nowISO(),
    };

    await db.mediaAssets.add(asset);
    return asset;
  },

  async storeExternal(url: string, type: MediaType, caption?: string): Promise<MediaAsset> {
    const asset: MediaAsset = {
      id: uid(),
      type,
      filename: url.split("/").pop() ?? "external",
      externalUrl: url,
      caption,
      tags: [],
      exerciseIds: [],
      createdAt: nowISO(),
    };
    await db.mediaAssets.add(asset);
    return asset;
  },

  async get(id: string): Promise<MediaAsset | undefined> {
    return db.mediaAssets.get(id);
  },

  async getMany(ids: string[]): Promise<MediaAsset[]> {
    return db.mediaAssets.where("id").anyOf(ids).toArray();
  },

  async getByExercise(exerciseId: string): Promise<MediaAsset[]> {
    return db.mediaAssets.where("exerciseIds").equals(exerciseId).toArray();
  },

  async getObjectUrl(id: string): Promise<string | null> {
    const asset = await db.mediaAssets.get(id);
    if (!asset) return null;
    if (asset.blob) return URL.createObjectURL(asset.blob);
    return asset.externalUrl ?? null;
  },

  async delete(id: string): Promise<void> {
    await db.mediaAssets.delete(id);
  },

  async getAll(): Promise<MediaAsset[]> {
    return db.mediaAssets.orderBy("createdAt").reverse().toArray();
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inferMediaType(file: File): MediaType {
  const mime = file.type.toLowerCase();
  if (mime.startsWith("image/gif"))       return "gif";
  if (mime.startsWith("image/"))          return "image";
  if (mime.startsWith("video/"))          return "video";
  if (mime === "application/pdf")         return "pdf";
  if (mime === "image/svg+xml")           return "svg";
  return "image";
}

async function compressImage(file: File, maxDim: number, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", quality);
    };
    img.src = URL.createObjectURL(file);
  });
}
