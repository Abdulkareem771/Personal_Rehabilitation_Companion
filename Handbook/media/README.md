# Media Architecture

This folder defines how future media assets are organized, named, documented, reviewed, and linked to exercise files.

No media files are stored here yet. The goal is to make hundreds of future exercise videos, images, audio cues, and references easy to add without changing the content model.

## Folder Map

| Folder | Purpose |
| --- | --- |
| [`videos/exercise-loops/`](./videos/exercise-loops/README.md) | Silent looping exercise demonstrations used inside exercise screens. |
| [`videos/coaching/`](./videos/coaching/README.md) | Longer coaching videos with explanation, corrections, or clinical context. |
| [`images/posters/`](./images/posters/README.md) | Poster frames paired with videos before playback. |
| [`images/thumbnails/`](./images/thumbnails/README.md) | Small preview images for cards, search, and exercise lists. |
| [`images/infographics/`](./images/infographics/README.md) | Educational diagrams and visual summaries. |
| [`audio/voice-cues/`](./audio/voice-cues/README.md) | Short spoken cues for guided sessions. |
| [`audio/countdowns/`](./audio/countdowns/README.md) | Beeps, timers, and transition sounds. |
| [`metadata/`](./metadata/README.md) | Templates for documenting media records before files exist. |

## Source Of Truth

- Exercise markdown files own the media fields used by the app.
- Media metadata files describe asset production, review, and file variants.
- Program files link to exercises, not media files.

## Required Standards

- [Naming Conventions](./naming-conventions.md)
- [Video Standards](./video-standards.md)
- [Poster Standards](./poster-standards.md)
- [Thumbnail Standards](./thumbnail-standards.md)
- [YouTube Reference Standards](./youtube-reference-standards.md)

## Asset Readiness States

- **planned:** Asset is needed but not filmed, designed, or recorded.
- **captured:** Raw source exists outside the app repository.
- **edited:** Final candidate exists and is ready for review.
- **approved:** Clinically and visually approved.
- **published:** Linked from the relevant exercise markdown file.
- **retired:** Replaced or no longer clinically preferred.

## Linking Rule

When an asset is published, update the related exercise markdown frontmatter fields:

- `videoLoop`
- `thumbnail`
- `youtube`

Poster images, coaching videos, voice cues, and countdown sounds should be linked through future structured fields only after the application schema supports them.
