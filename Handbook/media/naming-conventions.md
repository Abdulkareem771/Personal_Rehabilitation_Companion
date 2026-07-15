# Naming Conventions

## Core Pattern

Use lowercase kebab-case for every folder and file.

```text
exercise-id.asset-type.variant.version.extension
```

## Exercise Media Examples

```text
band-external-rotation.loop.front.v001.mp4
band-external-rotation.poster.front.v001.webp
band-external-rotation.thumb.front.v001.webp
band-external-rotation.coaching.common-mistakes.v001.mp4
band-external-rotation.voice-cue.elbow-position.v001.mp3
```

## Asset Type Tokens

| Token | Meaning |
| --- | --- |
| `loop` | Silent looping demonstration video. |
| `poster` | Still image shown before video playback. |
| `thumb` | Small preview image. |
| `coaching` | Longer instructional video. |
| `infographic` | Educational graphic. |
| `voice-cue` | Short spoken instruction. |
| `countdown` | Timer or transition sound. |

## Variant Tokens

Use the smallest useful variant name.

- `front`
- `side`
- `three-quarter`
- `beginner`
- `advanced`
- `band`
- `cable`
- `home`
- `gym`
- `common-mistakes`
- `regression`
- `progression`

## Versioning

- Start at `v001`.
- Increment when the exported asset changes.
- Do not overwrite approved assets without changing the version.
- Retire old files through metadata instead of deleting references silently.

## Relationship To Exercise IDs

The filename prefix must match the related exercise markdown filename without `.md`.

Example:

- Exercise: `Handbook/exercise-library/rotator-cuff/band-external-rotation.md`
- Media prefix: `band-external-rotation`
