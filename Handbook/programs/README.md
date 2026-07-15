# Rehabilitation Programs

This folder is the program-level source of truth for rehabilitation plans.

Programs do not describe exercise technique. Each program links to the exercise file that owns setup, execution, safety cues, progressions, regressions, and media references.

## Program Families

- [Shoulder Instability](./shoulder-instability/README.md)
- [Posture](./posture/README.md)
- [Maintenance](./maintenance/README.md)

## Program Rules

- Use only exercises that exist in [`../exercise-library/`](../exercise-library/00-exercise-index.md).
- Link to exercise files with relative markdown links.
- Keep dosage, sequencing, phase criteria, and weekly scheduling in the program file.
- Keep exercise descriptions, coaching details, and media fields in the exercise file.
- Progress only when symptoms, control, and recovery meet the listed checkpoints.
- Regress when pain, apprehension, compensation, or recovery quality fails the listed rules.

## Clinical Loading Scale

- **Low:** motor control, isometrics, mobility, symptom settling.
- **Moderate:** controlled strengthening with predictable resistance.
- **High:** larger ranges, higher volume, compound strength, fatigue tolerance.
- **Return-to-sport:** speed, perturbation, task-specific positions, repeated exposure.

## Standard Session Order

1. Mobility or tissue preparation.
2. Motor control and activation.
3. Primary strength work.
4. Accessory endurance work.
5. Core, trunk, or whole-body integration.
6. Cooldown, symptom check, and notes.

## Safety Rules

Stop or regress the session if any of the following occur:

- Sharp pain, catching, locking, or neurological symptoms.
- Shoulder apprehension that does not settle with load reduction.
- Loss of scapular control that cannot be corrected with cueing.
- Pain that increases after the session and remains elevated the next day.
- Night pain or resting pain that is worse than baseline.

## Templates

Use [program-template.md](./program-template.md) when adding a new program or phase.
