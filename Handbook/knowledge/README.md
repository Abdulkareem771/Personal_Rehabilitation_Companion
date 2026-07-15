# Knowledge Base

The knowledge base contains reusable rehabilitation concepts that support exercises, programs, media metadata, clinical logic, search, and future app experiences.

Use these documents when a concept applies across many exercises or programs. Exercise pages should link here instead of repeating general explanations.

## Navigation

| Document | Purpose |
| --- | --- |
| [Glossary](./glossary.md) | Plain-language definitions for common rehabilitation terms. |
| [Equipment Reference](./equipment-reference.md) | Standard names and usage notes for equipment. |
| [Muscle Reference](./muscle-reference.md) | Reusable muscle-group descriptions. |
| [Joint Reference](./joint-reference.md) | Joint terminology and common training considerations. |
| [Movement Patterns](./movement-patterns.md) | Shared movement concepts such as scapular retraction, bracing, and open chain. |
| [Rehabilitation Phases](./rehabilitation-phases.md) | Standard phase language used by programs and exercises. |
| [Posture Principles](./posture-principles.md) | Reusable posture concepts for desk work, training, and daily activity. |
| [Breathing Principles](./breathing-principles.md) | Breathing, bracing, and breath-holding guidance. |
| [Tempo Guide](./tempo-guide.md) | How to read and prescribe exercise tempo. |
| [Exercise Terminology](./exercise-terminology.md) | Sets, reps, holds, rest, intensity, and session terms. |

## Linking Convention

Use relative links from the document that needs the concept.

Examples:

```markdown
[Scapular upward rotation](../knowledge/movement-patterns.md#scapular-upward-rotation)
[Pain scale](../clinical/pain-scale.md)
```

## Authoring Rules

- Keep concept explanations here.
- Keep exercise-specific setup and execution in exercise files.
- Keep phase schedules and dosage in program files.
- Keep deterministic decision rules in [`../clinical/`](../clinical/README.md).
- Prefer stable headings so links remain durable over time.
- Write in short sections that render well on mobile and in PDFs.
