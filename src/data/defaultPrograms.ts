import { uid, nowISO } from "@/lib/utils";
import type { Program } from "@/types";

export const defaultPrograms: Program[] = [
  // ── 1. Phase 1 Shoulder Rehab & Stabilization ───────────────────────────────
  {
    id: "prog-phase1-stabilization",
    name: "Phase 1: Rotator Cuff & Scapular Stabilization",
    type: "rehabilitation",
    status: "active",
    description: "Foundational clinical protocol designed to restore dynamic humeral head centering and eliminate anterior shoulder subluxation.",
    phases: ["Stabilization", "Endurance", "Controlled Strength"],
    currentPhase: "Stabilization",
    currentWeek: 1,
    totalWeeks: 6,
    goals: [
      "Achieve zero clicking or subluxation during daily reaching",
      "Restore 2:1 scapulohumeral rhythm",
      "Build endurance in infraspinatus and teres minor"
    ],
    safetyNotes: "Never work through sharp anterior shoulder pain. Keep elbows tucked during all rotational exercises.",
    completionCriteria: "Complete 3 consecutive sessions at RPE ≤ 6 with pain ≤ 1/10.",
    versionNumber: 1,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    weeks: [
      {
        id: "w1",
        weekNumber: 1,
        goals: "Establish technique and neurological connection without fatigue.",
        days: [
          {
            id: "d1",
            name: "Day A: Rotator Cuff Focus",
            isRestDay: false,
            blocks: [
              {
                id: "b1",
                type: "warmup",
                name: "Postural Activation",
                order: 1,
                exercises: [
                  { id: "pe1", exerciseId: "chin-tuck", order: 1, sets: 2, reps: "12", restSecondsOverride: 30 },
                  { id: "pe2", exerciseId: "band-pull-apart", order: 2, sets: 2, reps: "15", restSecondsOverride: 45 }
                ]
              },
              {
                id: "b2",
                type: "strength",
                name: "Cuff Stabilization",
                order: 2,
                exercises: [
                  { id: "pe3", exerciseId: "band-external-rotation", order: 1, sets: 3, reps: "15", rpeTarget: 6, tempoOverride: "3-1-3", restSecondsOverride: 60 },
                  { id: "pe4", exerciseId: "serratus-punch", order: 2, sets: 3, reps: "12", rpeTarget: 6, tempoOverride: "2-2-2", restSecondsOverride: 60 }
                ]
              },
              {
                id: "b3",
                type: "core",
                name: "Core Integration",
                order: 3,
                exercises: [
                  { id: "pe5", exerciseId: "dead-bug", order: 1, sets: 3, reps: "10 per side", restSecondsOverride: 60 }
                ]
              }
            ]
          },
          {
            id: "d2",
            name: "Day B: Posterior Chain & Scapula",
            isRestDay: false,
            blocks: [
              {
                id: "b4",
                type: "warmup",
                name: "Warmup",
                order: 1,
                exercises: [
                  { id: "pe6", exerciseId: "wall-slide", order: 1, sets: 2, reps: "10", restSecondsOverride: 60 }
                ]
              },
              {
                id: "b5",
                type: "strength",
                name: "Scapular Control",
                order: 2,
                exercises: [
                  { id: "pe7", exerciseId: "face-pull", order: 1, sets: 3, reps: "15", rpeTarget: 6, restSecondsOverride: 60 },
                  { id: "pe8", exerciseId: "prone-yt", order: 2, sets: 2, reps: "10", rpeTarget: 6, restSecondsOverride: 60 }
                ]
              },
              {
                id: "b6",
                type: "strength",
                name: "Lower Body Maintenance",
                order: 3,
                exercises: [
                  { id: "pe9", exerciseId: "goblet-squat", order: 1, sets: 3, reps: "12", rpeTarget: 7, restSecondsOverride: 90 },
                  { id: "pe10", exerciseId: "romanian-deadlift", order: 2, sets: 3, reps: "12", rpeTarget: 7, restSecondsOverride: 90 }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
