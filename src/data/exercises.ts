import { uid, nowISO } from "@/lib/utils";
import type { Exercise } from "@/types";

export const defaultExercises: Exercise[] = [
  // ── 1. Band External Rotation ──────────────────────────────────────────────
  {
    id: "band-external-rotation",
    name: "Band External Rotation at 0° Abduction",
    category: "stability",
    safety: "green",

    difficulty: 1,
    equipment: ["band"],
    muscles: ["Infraspinatus", "Teres Minor"],
    secondaryMuscles: ["Posterior Deltoid", "Rhomboids"],
    tags: ["rotator-cuff", "shoulder-stability", "rehab", "home", "unilateral"],
    content: {
      purpose: "Strengthens the posterior rotator cuff to stabilize and dynamically center the humeral head in the glenoid fossa.",
      instructions: [
        "Attach a resistance band to a secure object at elbow height.",
        "Stand upright holding the band with your elbow bent at 90° and tucked firmly against your ribcage.",
        "Keep a small rolled towel between your elbow and ribcage to prevent shoulder abduction.",
        "Rotate your forearm outward away from your body against band resistance, keeping your wrist neutral.",
        "Hold the contracted position for 1 second, then slowly return over 3 seconds."
      ],
      breathingCues: "Exhale smoothly as you rotate outward; inhale as you slowly return.",
      tempoCue: "3-1-3 (lower 3s · pause 1s · rotate outward 3s)",
      restSeconds: 60,
      expectedDurationMin: 4,
      commonMistakes: [
        "Allowing the elbow to drift away from the ribcage during rotation.",
        "Arching the lower back or twisting the torso to create momentum.",
        "Using a band that is too heavy, causing anterior shoulder snapping."
      ],
      compensations: [
        "Shoulder hiking toward the ear (upper trapezius dominance).",
        "Wrist flexion to assist the rotation."
      ],
      regression: "Perform isometric holds against a door frame or use a lighter yellow resistance band.",
      progression: "Progress to side-lying external rotation with a 1 kg dumbbell, or step slightly farther from the anchor point.",
      contraindications: ["Acute anterior shoulder dislocation (< 2 weeks)", "Severe sharp rotator cuff pain during rotation"],
      safetyWarnings: "Never let your shoulder roll forward into anterior tilt during the return phase.",
      personalizedWhy: "Because your MRI demonstrated a Bankart lesion and recurrent anterior shoulder instability, strengthening the infraspinatus and teres minor acts as an active posterior brake, preventing anterior subluxation of the humeral head during everyday reaching and lifting tasks.",
      engineeringExplanation: "Think of the glenohumeral joint like a ball bearing sitting on a shallow golf tee. The rotator cuff muscles act as active centering springs pulling the ball firmly into the socket. Without strong posterior cuff tension, any forward force causes the ball to slide off the front edge.",
      expectedBenefit: 5,
      learningTips: [
        "Keep your elbow within 2 cm of your body throughout the movement. If your elbow drifts, the infraspinatus loses its mechanical advantage.",
        "Squeeze your shoulder blade gently downward before starting the outward rotation.",
        "Think of your forearm as a door swinging cleanly on its hinges."
      ]
    },
    mediaIds: [],
    relatedExerciseIds: ["side-lying-external-rotation", "face-pull", "serratus-punch"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 2. Serratus Punch ──────────────────────────────────────────────────────
  {
    id: "serratus-punch",
    name: "Supine Serratus Anterior Punch",
    category: "stability",
    safety: "green",
    difficulty: 1,
    equipment: ["dumbbell", "bodyweight"],
    muscles: ["Serratus Anterior"],
    secondaryMuscles: ["Anterior Deltoid", "Pectoralis Minor"],
    tags: ["scapular", "shoulder-stability", "rehab", "home", "bilateral"],
    content: {
      purpose: "Activates the serratus anterior to ensure proper upward rotation and protraction of the scapula against the ribcage.",
      instructions: [
        "Lie on your back with your knees bent and feet flat on the floor.",
        "Hold light dumbbells directly above your shoulders with arms completely straight.",
        "Without bending your elbows, reach your hands straight up toward the ceiling by pushing your shoulder blades forward.",
        "Hold the peak reach for 2 seconds, feeling your shoulder blades wrap around your ribcage.",
        "Lower your shoulder blades back down to the floor smoothly."
      ],
      breathingCues: "Exhale as you punch upward toward the ceiling; inhale as your shoulder blades sink back.",
      tempoCue: "2-2-2 (lower 2s · hold peak 2s · punch up 2s)",
      restSeconds: 60,
      expectedDurationMin: 3,
      commonMistakes: [
        "Bending the elbows like a bench press instead of isolating scapular movement.",
        "Shrugging the shoulders up toward the ears instead of reaching forward."
      ],
      compensations: ["Lifting the head and neck off the floor."],
      regression: "Perform supine punches without weights (bodyweight only).",
      progression: "Transition to standing resistance band serratus punches or push-up plus on an incline.",
      contraindications: ["Acute clavicular injury"],
      safetyWarnings: "Keep the back of your neck long and relaxed on the mat throughout.",
      personalizedWhy: "The serratus anterior holds the scapula flat against the thoracic wall. In Bankart instability, scapular winging creates abnormal glenoid angulation, which drastically increases stress on the injured anterior labrum.",
      engineeringExplanation: "The scapula is the mounting bracket for the shoulder joint. If the mounting bracket tilts or vibrates under load, the bearing inside suffers eccentric wear and instability.",
      expectedBenefit: 5,
      learningTips: [
        "Imagine trying to touch the ceiling with your knuckles while keeping your back on the mat.",
        "Focus on feeling a deep wrapping sensation along the side of your ribs under your armpits."
      ]
    },
    mediaIds: [],
    relatedExerciseIds: ["wall-slide", "scapular-shrug", "band-external-rotation"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 3. Face Pull ───────────────────────────────────────────────────────────
  {
    id: "face-pull",
    name: "Resistance Band Face Pull with External Rotation",
    category: "posture",
    safety: "green",
    difficulty: 2,
    equipment: ["band", "cable"],
    muscles: ["Posterior Deltoid", "Infraspinatus", "Middle Trapezius"],
    secondaryMuscles: ["Rhomboids", "Lower Trapezius"],
    tags: ["posture", "rotator-cuff", "scapular", "rehab", "gym"],
    content: {
      purpose: "Strengthens upper back retractors and external rotators simultaneously to reverse rounded shoulder posture.",
      instructions: [
        "Anchor a band or cable rope slightly above head height.",
        "Grasp the ends with an overhand grip, thumbs pointing back.",
        "Step back to create tension and stand tall with core braced.",
        "Pull the handles directly toward your forehead while driving your elbows wide and back.",
        "At the end of the pull, externally rotate your wrists back so your knuckles face the wall behind you.",
        "Squeeze shoulder blades together for 2 seconds, then return under control."
      ],
      breathingCues: "Exhale deeply as you pull toward your face; inhale on the controlled extension.",
      tempoCue: "3-2-2 (return 3s · hold squeeze 2s · pull 2s)",
      restSeconds: 60,
      expectedDurationMin: 5,
      commonMistakes: [
        "Pulling toward the chest instead of face height.",
        "Letting the elbows drop below wrist level during the pull.",
        "Jutting the chin forward to meet the band."
      ],
      compensations: ["Arching lower back to pull heavier resistance."],
      regression: "Perform seated face pulls with a light resistance band anchored at eye level.",
      progression: "Use a cable machine with a rope attachment at moderate weight.",
      contraindications: ["Acute neck impingement"],
      safetyWarnings: "Maintain a tall neutral spine and double chin tuck throughout the set.",
      personalizedWhy: "By strengthening the rear shoulder girdle and retracting the scapulae, this exercise expands the subacromial space and naturally centers the humeral head away from anterior capsular vulnerability.",
      expectedBenefit: 5,
      learningTips: [
        "Lead the pull with your elbows, spreading them apart like wings.",
        "Aim to finish the movement in a double-biceps pose with your thumbs pointing backward."
      ]
    },
    mediaIds: [],
    relatedExerciseIds: ["band-pull-apart", "prone-yt", "band-external-rotation"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 4. Band Pull-Apart ─────────────────────────────────────────────────────
  {
    id: "band-pull-apart",
    name: "Horizontal Band Pull-Apart",
    category: "posture",
    safety: "green",
    difficulty: 1,
    equipment: ["band"],
    muscles: ["Middle Trapezius", "Rhomboids", "Posterior Deltoid"],
    secondaryMuscles: ["Lower Trapezius"],
    tags: ["posture", "warmup", "scapular", "home"],
    content: {
      purpose: "Activates interscapular muscles to combat forward shoulder slump from desk posture.",
      instructions: [
        "Hold a resistance band at chest height with straight arms, palms facing up or down.",
        "Keep shoulders pulled down away from your ears.",
        "Pull the band horizontally apart until it gently touches your mid-chest.",
        "Squeeze your shoulder blades firmly together for 1-2 seconds.",
        "Return slowly until the band has mild tension remaining."
      ],
      breathingCues: "Exhale during the pull-apart; inhale on return.",
      tempoCue: "2-1-2",
      restSeconds: 45,
      expectedDurationMin: 3,
      commonMistakes: [
        "Shrugging shoulders upward during the pull.",
        "Bending elbows excessively to complete the rep."
      ],
      compensations: ["Ribcage flaring or lumbar extension."],
      regression: "Use a wider grip on the band to reduce resistance.",
      progression: "Double the band or pause for 3 full seconds at peak contraction.",
      contraindications: ["None"],
      safetyWarnings: "Keep wrists straight and avoid snapping the band back.",
      personalizedWhy: "Daily posture correction is mandatory for shoulder rehabilitation. Rounded shoulders tilt the scapula anteriorly, pinching anterior structures during daily reaching.",
      expectedBenefit: 4,
      learningTips: [
        "Imagine crushing a pencil between your shoulder blades at the peak of every rep.",
        "Keep your chest proud and collarbones wide."
      ]
    },
    mediaIds: [],
    relatedExerciseIds: ["face-pull", "wall-angel", "prone-yt"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 5. Wall Slide ──────────────────────────────────────────────────────────
  {
    id: "wall-slide",
    name: "Scapular Wall Slide with Liftoff",
    category: "mobility",
    safety: "green",
    difficulty: 2,
    equipment: ["bodyweight"],
    muscles: ["Lower Trapezius", "Serratus Anterior"],
    secondaryMuscles: ["Anterior Deltoid"],
    tags: ["mobility", "scapular", "posture", "rehab"],
    content: {
      purpose: "Promotes healthy scapulohumeral rhythm and upward rotation without impingement.",
      instructions: [
        "Stand with your back against a wall, feet placed 15 cm out.",
        "Press your head, upper back, tailbone, forearms, and wrists firmly against the wall.",
        "Slowly slide your forearms up the wall into a 'Y' position while maintaining full wall contact.",
        "At top reach, gently lift forearms 1 cm off the wall using your lower trapezius.",
        "Slide back down slowly to starting 'W' position."
      ],
      breathingCues: "Exhale as you slide upward; inhale as you lower.",
      tempoCue: "3-1-3",
      restSeconds: 60,
      expectedDurationMin: 4,
      commonMistakes: [
        "Letting lower back arch away from wall.",
        "Wrists losing contact during the upward slide."
      ],
      compensations: ["Head jutting forward off the wall."],
      regression: "Perform facing away from wall without touching forearms, focusing only on shoulder motion.",
      progression: "Add a light resistance band around wrists during the slide.",
      contraindications: ["Painful subacromial impingement > 4/10"],
      safetyWarnings: "Only slide as high as you can without losing ribcage control or causing pain.",
      personalizedWhy: "Restoring smooth 2:1 scapulohumeral rhythm ensures your shoulder blade moves smoothly with your arm, preventing mechanical overload on the anterior capsule.",
      expectedBenefit: 4,
      learningTips: [
        "Keep your lower ribs tucked down against the wall at all times.",
        "Press elbows outward slightly into the wall as you slide."
      ]
    },
    mediaIds: [],
    relatedExerciseIds: ["serratus-punch", "wall-angel", "scapular-shrug"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 6. Prone Y-T ───────────────────────────────────────────────────────────
  {
    id: "prone-yt",
    name: "Prone Y and T Scapular Raises",
    category: "stability",
    safety: "green",
    difficulty: 2,
    equipment: ["bodyweight"],
    muscles: ["Lower Trapezius", "Middle Trapezius"],
    secondaryMuscles: ["Rhomboids", "Posterior Deltoid"],
    tags: ["scapular", "rotator-cuff", "rehab", "home"],
    content: {
      purpose: "Targets lower and middle trapezius to stabilize scapular depression and retraction.",
      instructions: [
        "Lie face down on a mat or incline bench with forehead resting gently.",
        "For 'Y': Extend arms forward at 45° angle, thumbs pointing up toward ceiling.",
        "Lift arms 5 cm off floor by driving shoulder blades down and back. Hold 2 seconds.",
        "For 'T': Extend arms straight out to the sides at shoulder height, thumbs pointing up.",
        "Squeeze shoulder blades together to lift arms. Hold 2 seconds."
      ],
      breathingCues: "Exhale on lift; inhale on lower.",
      tempoCue: "2-2-2",
      restSeconds: 60,
      expectedDurationMin: 5,
      commonMistakes: ["Using momentum to jerk arms up.", "Shrugging shoulders into ears."],
      compensations: ["Lifting lower back or extending cervical spine excessively."],
      regression: "Perform standing bent-over at 45° without weights.",
      progression: "Hold 0.5 kg dumbbells.",
      contraindications: ["Lower back acute pain"],
      safetyWarnings: "Focus on scapular contraction, not height of the arm lift.",
      personalizedWhy: "Lower trapezius weakness is a primary driver of anterior shoulder instability. Weak lower traps allow the glenoid to tilt anterior-inferiorly under arm weight.",
      expectedBenefit: 5,
      learningTips: [
        "Always lead the movement with your shoulder blades, not your hands.",
        "Point your thumbs upward like hitchhiking to maximize external rotation."
      ]
    },
    mediaIds: [],
    relatedExerciseIds: ["face-pull", "band-pull-apart"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 7. Dead Bug ────────────────────────────────────────────────────────────
  {
    id: "dead-bug",
    name: "Core Dead Bug with Shoulder Stabilization",
    category: "core",
    safety: "green",
    difficulty: 2,
    equipment: ["bodyweight"],
    muscles: ["Transverse Abdominis", "Rectus Abdominis"],
    secondaryMuscles: ["Hip Flexors", "Serratus Anterior"],
    tags: ["core", "rehab", "home", "bilateral"],
    content: {
      purpose: "Builds lumbopelvic stability and core stiffness without stressing shoulder capsules.",
      instructions: [
        "Lie on your back with arms extended up toward ceiling and knees bent at 90° directly over hips.",
        "Press your lower back firmly flat into the mat.",
        "Slowly lower your right arm backward and left leg forward toward the floor simultaneously.",
        "Pause just before touching the mat while maintaining 100% lower back contact.",
        "Exhale and pull limbs back to start position."
      ],
      breathingCues: "Exhale forcefully as limbs extend; inhale as they return.",
      tempoCue: "3-1-3",
      restSeconds: 60,
      expectedDurationMin: 4,
      commonMistakes: ["Allowing lower back to arch off floor."],
      compensations: ["Holding breath during extension."],
      regression: "Move only legs while keeping arms pointing straight up.",
      progression: "Hold a stability ball between opposite hand and knee.",
      contraindications: ["None"],
      safetyWarnings: "Stop lowering limbs immediately if your lower back peels off the mat.",
      personalizedWhy: "A stable lumbopelvic core provides a solid foundation for energy transfer through the kinetic chain, reducing compensatory strain on the shoulder complex during arm movements.",
      expectedBenefit: 4,
      learningTips: ["Imagine holding a piece of paper under your lower back that someone is trying to pull out."]
    },
    mediaIds: [],
    relatedExerciseIds: ["pallof-press", "bird-dog"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 8. Goblet Squat ────────────────────────────────────────────────────────
  {
    id: "goblet-squat",
    name: "Kettlebell / Dumbbell Goblet Squat",
    category: "strength",
    safety: "green",
    difficulty: 2,
    equipment: ["dumbbell", "kettlebell"],
    muscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Core", "Upper Back"],
    tags: ["strength", "bilateral", "gym", "home"],
    content: {
      purpose: "Develops lower body strength and core upright stability in a shoulder-friendly anterior load position.",
      instructions: [
        "Hold a kettlebell or dumbbell vertically against your chest with elbows tucked tight to ribcage.",
        "Stand with feet shoulder-width apart, toes pointed slightly outward.",
        "Brace core and lower hips back and down as if sitting into a deep chair.",
        "Keep chest proud and elbows inside knees at bottom of squat.",
        "Drive through heels to stand tall."
      ],
      breathingCues: "Inhale on descent; exhale forcefully on ascent.",
      tempoCue: "3-1-1",
      restSeconds: 90,
      expectedDurationMin: 6,
      commonMistakes: ["Letting chest collapse forward.", "Knees caving inward."],
      compensations: ["Heels rising off floor."],
      regression: "Bodyweight box squat onto a chair.",
      progression: "Increase kettlebell weight.",
      contraindications: ["Acute knee meniscus pain"],
      safetyWarnings: "Keep weight tucked close to sternum; never let arms reach away from torso.",
      personalizedWhy: "Maintaining leg and hip strength during shoulder recovery preserves overall metabolic fitness without loading the shoulder girdle in vulnerable overhead or back-racked positions.",
      expectedBenefit: 4,
      learningTips: ["Keep elbows tucked close to your ribs to protect your shoulder labrum."]
    },
    mediaIds: [],
    relatedExerciseIds: ["romanian-deadlift", "leg-press"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 9. Romanian Deadlift ───────────────────────────────────────────────────
  {
    id: "romanian-deadlift",
    name: "Dumbbell Romanian Deadlift (RDL)",
    category: "strength",
    safety: "green",
    difficulty: 2,
    equipment: ["dumbbell"],
    muscles: ["Hamstrings", "Gluteus Maximus"],
    secondaryMuscles: ["Erector Spinae", "Upper Back"],
    tags: ["strength", "posterior-chain", "gym", "home"],
    content: {
      purpose: "Strengthens posterior chain and hip hinge mechanics with isometric shoulder depression.",
      instructions: [
        "Hold dumbbells in front of thighs with shoulders locked down and back.",
        "Keep knees softly bent (15°) and maintain neutral spine.",
        "Hinge at hips by pushing tailbone straight backward toward wall behind you.",
        "Lower weights along shins until you feel a deep hamstring stretch.",
        "Drive hips forward and squeeze glutes to return tall."
      ],
      breathingCues: "Inhale going down; exhale coming up.",
      tempoCue: "3-1-1",
      restSeconds: 90,
      expectedDurationMin: 6,
      commonMistakes: ["Rounding upper or lower back.", "Squatting down instead of hinging hips back."],
      compensations: ["Shoulders rolling forward under weight."],
      regression: "Bodyweight hip hinge holding a dowel along spine.",
      progression: "Heavier dumbbells or barbell RDL.",
      contraindications: ["Acute lumbar disc herniation"],
      safetyWarnings: "Never allow shoulders to slump forward at the bottom of the hinge.",
      personalizedWhy: "Holding dumbbells with locked-down scapulae provides isometric strengthening for shoulder stabilizers while conditioning the essential posterior chain.",
      expectedBenefit: 4,
      learningTips: ["Keep dumbbells skimming your thighs and shins the entire way down."]
    },
    mediaIds: [],
    relatedExerciseIds: ["goblet-squat"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },

  // ── 10. Chin Tuck ──────────────────────────────────────────────────────────
  {
    id: "chin-tuck",
    name: "Cervical Retraction (Chin Tuck)",
    category: "posture",
    safety: "green",
    difficulty: 1,
    equipment: ["bodyweight"],
    muscles: ["Deep Cervical Flexors"],
    secondaryMuscles: ["Upper Trapezius"],
    tags: ["posture", "home", "warmup"],
    content: {
      purpose: "Alleviates forward head posture that neurologically inhibits shoulder blade elevators.",
      instructions: [
        "Sit or stand tall looking straight ahead.",
        "Without tilting head up or down, glide chin straight backward as if making a double chin.",
        "Feel gentle lengthening at back of neck.",
        "Hold for 3 seconds, relax smoothly."
      ],
      breathingCues: "Breathe normally throughout.",
      tempoCue: "1-3-1",
      restSeconds: 30,
      expectedDurationMin: 2,
      commonMistakes: ["Looking down at floor while pulling chin back."],
      compensations: ["Holding breath."],
      regression: "Perform lying face up on floor.",
      progression: "Add gentle overpressure with two fingers on chin.",
      contraindications: ["Acute cervical spine trauma"],
      safetyWarnings: "Keep gaze level with horizon.",
      personalizedWhy: "Forward head posture directly alters scapular rest position, closing the subacromial space and creating secondary shoulder instability.",
      expectedBenefit: 4,
      learningTips: ["Imagine sliding your head straight backward along a horizontal shelf."]
    },
    mediaIds: [],
    relatedExerciseIds: ["band-pull-apart", "wall-slide"],
    collectionIds: [],
    isCustom: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
];
