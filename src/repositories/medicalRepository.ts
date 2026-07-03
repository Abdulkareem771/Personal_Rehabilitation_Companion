// ─────────────────────────────────────────────────────────────────────────────
// Medical Repository — timeline events and imaging vault
// ─────────────────────────────────────────────────────────────────────────────
import { db } from "@/lib/db";
import { uid } from "@/lib/utils";
import type { MedicalEvent, MedicalImage, MedicalEventType, ImagingType } from "@/types";

export const medicalRepository = {
  // ── Timeline Events ───────────────────────────────────────────────────────

  async getEvents(): Promise<MedicalEvent[]> {
    return db.medicalEvents.orderBy("date").reverse().toArray();
  },

  async getEventsByType(type: MedicalEventType): Promise<MedicalEvent[]> {
    return db.medicalEvents.where("type").equals(type).reverse().sortBy("date");
  },

  async createEvent(data: Omit<MedicalEvent, "id">): Promise<MedicalEvent> {
    const event: MedicalEvent = { id: uid(), ...data };
    await db.medicalEvents.add(event);
    return event;
  },

  async updateEvent(id: string, updates: Partial<MedicalEvent>): Promise<void> {
    await db.medicalEvents.update(id, updates);
  },

  async deleteEvent(id: string): Promise<void> {
    await db.medicalEvents.delete(id);
  },

  // ── Imaging Vault ─────────────────────────────────────────────────────────

  async getImages(): Promise<MedicalImage[]> {
    return db.medicalImages.orderBy("date").reverse().toArray();
  },

  async getImagesByType(imagingType: ImagingType): Promise<MedicalImage[]> {
    return db.medicalImages.where("imagingType").equals(imagingType).reverse().sortBy("date");
  },

  async createImage(data: Omit<MedicalImage, "id">): Promise<MedicalImage> {
    const image: MedicalImage = { id: uid(), ...data };
    await db.medicalImages.add(image);
    return image;
  },

  async updateImage(id: string, updates: Partial<MedicalImage>): Promise<void> {
    await db.medicalImages.update(id, updates);
  },

  async deleteImage(id: string): Promise<void> {
    await db.medicalImages.delete(id);
  },
};
