# Exercise Metadata Schema

This document defines the canonical metadata schema for every exercise in the ReForge exercise library.

Exercise markdown files remain the source of truth for exercise content. Frontmatter fields provide structured data for React, future Android, search, AI summaries, printable PDFs, and clinical decision support.

## Schema Principles

- Every exercise must have a stable unique ID.
- Field names should remain consistent across platforms.
- Values should use predictable lowercase tokens where possible.
- Human-readable content belongs in markdown sections.
- Structured values belong in frontmatter.
- Media paths should follow the [media naming conventions](../media/naming-conventions.md).
- Clinical decisions should reference [`../clinical/`](../clinical/README.md) rules where possible.

## Canonical Frontmatter

```yaml
---
id: ""
title: ""
slug: ""
category: ""
difficulty: ""
rehabilitationPhase: ""
equipment: []
primaryMuscles: []
secondaryMuscles: []
movementPattern: ""
joint: ""
planeOfMotion: ""
safetyLevel: ""
estimatedDuration: ""
defaultSets: ""
defaultReps: ""
defaultTempo: ""
defaultRest: ""
videoLoop: ""
thumbnail: ""
poster: ""
youtube: ""
relatedExercises: []
tags: []
progressions: []
regressions: []
contraindications: []
clinicalNotes: []
references: []
---
```

## Field Definitions

| Field | Type | Why It Exists | App Consumption |
| --- | --- | --- | --- |
| `id` | string | Stable unique identifier independent of title changes. | Primary key for saved plans, logs, search records, and offline cache. |
| `title` | string | Human-readable exercise name. | Display title in web, Android, PDF, and search results. |
| `slug` | string | URL-safe identifier. | Routing, deep links, media matching, and API paths. |
| `category` | string | Groups exercises by library section. | Filters, navigation, program builders, and analytics. |
| `difficulty` | string | Indicates broad user-facing difficulty. | Sorting, filtering, onboarding, and substitutions. |
| `rehabilitationPhase` | string | Connects exercise to a standard phase. | Phase-based program generation and clinical guardrails. |
| `equipment` | array | Lists required equipment. | Filters, home/gym mode, substitutions, and shopping lists. |
| `primaryMuscles` | array | Identifies the main training target. | Search, education, program balance, and AI summaries. |
| `secondaryMuscles` | array | Identifies supporting muscles. | Search expansion and training-load awareness. |
| `movementPattern` | string | Describes the main reusable movement concept. | Movement filters, substitutions, and knowledge links. |
| `joint` | string | Identifies the main joint or body region. | Clinical logic, search, program matching, and symptom mapping. |
| `planeOfMotion` | string | Describes sagittal, frontal, transverse, or multi-plane demand. | Program variety and movement-balance analysis. |
| `safetyLevel` | string | Indicates relative clinical caution. | Warnings, progression gates, and assistant responses. |
| `estimatedDuration` | string | Helps users and apps plan sessions. | Session time estimates and adherence design. |
| `defaultSets` | string | Provides baseline dosage. | Session builder defaults and PDF prescriptions. |
| `defaultReps` | string | Provides baseline repetitions or hold duration. | Session builder defaults and timers. |
| `defaultTempo` | string | Defines default speed or hold style. | Timers, coaching cues, and consistency tracking. |
| `defaultRest` | string | Defines recovery between sets. | Timers and fatigue management. |
| `videoLoop` | string | Links silent loop demonstration. | Exercise screen media playback and offline media cache. |
| `thumbnail` | string | Links small preview image. | Cards, search, program previews, and offline cache. |
| `poster` | string | Links video poster image. | Preload state, print fallback, and low-bandwidth display. |
| `youtube` | string | Links reviewed external reference. | Temporary visual reference or supplemental coaching. |
| `relatedExercises` | array | Lists nearby substitutions or variations. | Recommendations, substitutions, and graph navigation. |
| `tags` | array | Adds searchable labels. | Search indexing, filtering, AI retrieval, and analytics. |
| `progressions` | array | Lists harder related options or progression concepts. | Program advancement and clinical assistant suggestions. |
| `regressions` | array | Lists easier related options or regression concepts. | Symptom-led substitutions and flare-up support. |
| `contraindications` | array | Lists reasons to avoid or delay the exercise. | Safety notices and clinical decision support. |
| `clinicalNotes` | array | Stores concise structured clinical cautions. | AI assistant grounding and clinician review. |
| `references` | array | Links evidence, handbook references, or review notes. | Auditability, citations, and PDF references. |

## Recommended Controlled Values

### Difficulty

- `beginner`
- `intermediate`
- `advanced`

### Rehabilitation Phase

Use values aligned with [Rehabilitation Phases](../knowledge/rehabilitation-phases.md):

- `stabilization`
- `strength`
- `functional-strength`
- `return-to-sport`
- `maintenance`

### Safety Level

- `low`
- `moderate`
- `high`
- `clinical-review`

### Plane Of Motion

Use values aligned with [Movement Patterns](../knowledge/movement-patterns.md#plane-of-motion):

- `sagittal`
- `frontal`
- `transverse`
- `multi-plane`
- `isometric`

### Equipment

Use stable labels from [Equipment Reference](../knowledge/equipment-reference.md).

## Linkable Knowledge Fields

Exercises should link concepts to reusable documents:

- Movement concepts: [Movement Patterns](../knowledge/movement-patterns.md)
- Equipment: [Equipment Reference](../knowledge/equipment-reference.md)
- Muscles: [Muscle Reference](../knowledge/muscle-reference.md)
- Joints: [Joint Reference](../knowledge/joint-reference.md)
- Tempo: [Tempo Guide](../knowledge/tempo-guide.md)
- Pain and symptom decisions: [Pain Scale](../clinical/pain-scale.md)
- Progression: [Progression Rules](../clinical/progression-rules.md)
- Regression: [Regression Rules](../clinical/regression-rules.md)

## React Web App Consumption

The React app should treat frontmatter as structured data and markdown body content as renderable education.

Expected usage:

- Build exercise cards from `title`, `thumbnail`, `difficulty`, `category`, and `equipment`.
- Build exercise detail pages from frontmatter plus markdown sections.
- Use `videoLoop`, `poster`, and `youtube` for media rendering.
- Use `defaultSets`, `defaultReps`, `defaultTempo`, and `defaultRest` for session defaults.
- Use `tags`, `movementPattern`, `joint`, and `primaryMuscles` for search and filters.
- Use `safetyLevel`, `contraindications`, and clinical links for caution displays.

## Future Android Consumption

Android should use the same schema to avoid platform-specific content forks.

Expected usage:

- Cache exercise records by `id`.
- Cache media paths declared by `videoLoop`, `thumbnail`, and `poster`.
- Support offline filtering by category, equipment, phase, and difficulty.
- Render markdown sections consistently with the web app.
- Preserve saved user plans even if a title changes by relying on `id`.

## Search And AI Consumption

Search and AI systems should index both structured fields and markdown sections.

Priority fields:

- `title`
- `category`
- `tags`
- `movementPattern`
- `joint`
- `primaryMuscles`
- `secondaryMuscles`
- `rehabilitationPhase`
- `clinicalNotes`

AI summaries should prefer handbook links over generating new explanations for shared concepts.

## Clinical Decision Support Consumption

Future CDSS logic should use metadata to:

- Match exercises to phase.
- Filter by safety level.
- Avoid contraindicated selections.
- Suggest progressions and regressions.
- Apply pain, fatigue, and recovery rules.
- Identify when clinical review is appropriate.

Clinical decision logic should reference the deterministic documents in [`../clinical/`](../clinical/README.md).

## Internal Linking Convention

Use relative markdown links.

From an exercise file:

```markdown
See [external rotation](../knowledge/movement-patterns.md#external-rotation).
Follow the [pain scale](../clinical/pain-scale.md).
```

From a category README:

```markdown
Use [rehabilitation phases](../knowledge/rehabilitation-phases.md) to classify exercises.
```

From a program file:

```markdown
Apply the [progression rules](../../clinical/progression-rules.md) before advancing.
```

## Versioning Notes

When the schema changes:

- Add new fields without removing old fields when possible.
- Keep old IDs stable.
- Document migration needs in this file.
- Avoid platform-specific field names.

## Related Documents

- [Exercise Template](./exercise-template.md)
- [Knowledge Base](../knowledge/README.md)
- [Clinical Logic](../clinical/README.md)
- [Media Architecture](../media/README.md)
