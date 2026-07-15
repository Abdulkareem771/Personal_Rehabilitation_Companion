# Clinical Logic

The clinical folder contains deterministic rehabilitation rules for symptom response, exercise selection, progression, regression, fatigue, and recovery.

These documents are written for future use by apps, clinical decision support, AI summaries, and printable handbook views. They do not replace individualized medical care.

## Navigation

| Document | Purpose |
| --- | --- |
| [Pain Scale](./pain-scale.md) | Standard symptom thresholds for exercise decisions. |
| [Stop Rules](./stop-rules.md) | Conditions that require stopping or clinical review. |
| [Progression Rules](./progression-rules.md) | Criteria for increasing difficulty. |
| [Regression Rules](./regression-rules.md) | Criteria for reducing difficulty. |
| [Exercise Selection](./exercise-selection.md) | How to choose exercises based on goal, phase, symptoms, and equipment. |
| [Instability Signs](./instability-signs.md) | Warning signs relevant to shoulder and joint instability. |
| [Fatigue Management](./fatigue-management.md) | Rules for managing tiredness and form breakdown. |
| [Flare-Up Management](./flare-up-management.md) | Short-term response to symptom increases. |
| [Recovery Principles](./recovery-principles.md) | Recovery rules for sleep, spacing, soreness, and readiness. |

## Decision Style

Clinical rules should be:

- Clear.
- Conservative.
- Reusable.
- Easy to encode later.
- Based on symptom response and movement quality.

## Linking Convention

Exercise pages should link to the relevant clinical rule instead of repeating the full logic.

Examples:

```markdown
Follow the [pain scale](../clinical/pain-scale.md) during all sets.
Use the [regression rules](../clinical/regression-rules.md) if form changes.
```
