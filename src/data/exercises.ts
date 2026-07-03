import type { Exercise } from "../types";

export const exercises: Exercise[] = [
  {
    id: "external-rotation",
    name: "Band External Rotation",
    category: "stability",
    safety: "green",
    purpose: "Rebuild rotator cuff control without overhead loading.",
    muscles: ["Infraspinatus", "Teres minor", "Posterior cuff"],
    whyYouNeedIt: "It trains the muscles that help keep the humeral head centered when the shoulder wants to drift forward.",
    engineeringAnalogy: "The cuff acts like a centering bearing. Small, consistent force keeps the joint aligned before larger muscles add power.",
    instructions: ["Elbow tucked at side", "Rotate slowly outward", "Pause for one second", "Return under control"],
    mistakes: ["Letting the elbow float", "Arching the back", "Using a band that is too heavy"],
    progression: "Add a second pause or slightly stronger band.",
    regression: "Use no band and focus on pain-free motion.",
    warnings: "Stop for sharp pain, slipping, or apprehension."
  },
  {
    id: "serratus-punch",
    name: "Serratus Punch",
    category: "stability",
    safety: "green",
    purpose: "Improve scapular control and upward rotation.",
    muscles: ["Serratus anterior", "Lower trapezius"],
    whyYouNeedIt: "A stable shoulder blade gives the rotator cuff a better base to control the ball-and-socket joint.",
    engineeringAnalogy: "A motor mounted to a loose bracket wastes force. The scapula is the bracket.",
    instructions: ["Lie on back", "Reach fist toward ceiling", "Lift shoulder blade slightly", "Lower slowly"],
    mistakes: ["Shrugging", "Bending the elbow", "Moving too quickly"],
    progression: "Use a light dumbbell after perfect control.",
    regression: "Do it standing against a wall.",
    warnings: "Keep the arm below any position that feels unstable."
  },
  {
    id: "chest-supported-row",
    name: "Chest-Supported Row",
    category: "gym",
    safety: "yellow",
    purpose: "Build upper-back strength while minimizing anterior shoulder shear.",
    muscles: ["Middle trapezius", "Rhomboids", "Rear deltoid", "Latissimus dorsi"],
    whyYouNeedIt: "It strengthens the muscles that keep the shoulder blade set so the cuff can center the humeral head.",
    engineeringAnalogy: "The shoulder is a ball bearing in a housing. If the base moves, more engine power will not fix alignment.",
    instructions: ["Chest stays on bench", "Pull elbows beside ribs", "Squeeze shoulder blades gently", "Lower fully under control"],
    mistakes: ["Flaring elbows high", "Yanking from the arm", "Overextending the shoulder at the bottom"],
    progression: "Add load only when pain and instability stay low.",
    regression: "Use a band row with smaller range.",
    warnings: "Avoid aggressive deep stretches at the bottom."
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: "gym",
    safety: "green",
    purpose: "Train legs heavily without loading the shoulders.",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    whyYouNeedIt: "It lets you keep building muscle and confidence while protecting unstable shoulder positions.",
    engineeringAnalogy: "Move load through the lower-body frame while the shoulder system stays unloaded.",
    instructions: ["Set back firmly", "Feet shoulder width", "Lower to comfortable depth", "Drive evenly through both feet"],
    mistakes: ["Locking knees hard", "Letting hips curl off the pad", "Chasing load too quickly"],
    progression: "Add small weight jumps when reps feel controlled.",
    regression: "Reduce depth or use bodyweight split squats.",
    warnings: "Do not grip handles hard if it provokes shoulder symptoms."
  }
];

export const safetyCopy = {
  green: "Safe",
  yellow: "Caution",
  red: "Avoid"
} as const;
