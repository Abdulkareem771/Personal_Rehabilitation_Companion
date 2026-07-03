import { nowISO } from "@/lib/utils";
import type { MediaAsset } from "@/types";

export const defaultMediaAssets: MediaAsset[] = [
  {
    id: "media-scapular-rhythm",
    type: "infographic",
    filename: "scapulohumeral_rhythm_diagram.svg",
    caption: "2:1 Scapulohumeral Rhythm: For every 2° of glenohumeral abduction, the scapula must rotate upward by 1° to maintain subacromial space clearance.",
    tags: ["biomechanics", "scapula", "shoulder-stability", "rotator-cuff"],
    exerciseIds: ["band-external-rotation", "serratus-punch", "wall-slide", "prone-yt"],
    createdAt: nowISO(),
  },
  {
    id: "media-bankart-anatomy",
    type: "infographic",
    filename: "bankart_lesion_anterior_capsule.svg",
    caption: "Anterior Labral Tear (Bankart Lesion): Notice how dynamic contraction of the infraspinatus and teres minor pulls the humeral head posteriorly away from the injured anterior lip.",
    tags: ["anatomy", "bankart", "instability", "rotator-cuff"],
    exerciseIds: ["band-external-rotation", "prone-yt"],
    createdAt: nowISO(),
  },
  {
    id: "media-serratus-protraction",
    type: "infographic",
    filename: "serratus_anterior_protraction.svg",
    caption: "Scapular Protraction vs. Upper Trapezius Shrugging: Ensure the shoulder blade glides forward around the ribcage without elevating toward the ear.",
    tags: ["scapula", "serratus", "posture"],
    exerciseIds: ["serratus-punch", "wall-slide", "dead-bug"],
    createdAt: nowISO(),
  },
  {
    id: "media-subacromial-space",
    type: "infographic",
    filename: "subacromial_impingement_prevention.svg",
    caption: "Impingement Zone Prevention: Keeping slight external rotation during reaching prevents the greater tubercle from pinching supraspinatus tendons against the acromion.",
    tags: ["impingement", "safety", "shoulder-stability"],
    exerciseIds: ["band-external-rotation", "wall-slide", "face-pull"],
    createdAt: nowISO(),
  },
  {
    id: "media-ergonomic-posture",
    type: "infographic",
    filename: "cervico_thoracic_alignment.svg",
    caption: "Forward Head Posture Multiplier: Every inch of anterior head carriage adds roughly 10 lbs of lever stress on the lower cervical spine and shoulder girdle.",
    tags: ["posture", "ergonomcs", "neck"],
    exerciseIds: ["chin-tuck", "band-pull-apart", "face-pull"],
    createdAt: nowISO(),
  }
];
