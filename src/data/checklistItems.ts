import { uid } from "@/lib/utils";
import type { ChecklistItem } from "@/types";

export const defaultChecklistItems: ChecklistItem[] = [
  { id: uid(), label: "Take morning rehabilitation supplements", period: "morning", order: 1, isDefault: true },
  { id: uid(), label: "Complete 10-minute posture routine",       period: "morning", order: 2, isDefault: true },
  { id: uid(), label: "Log morning shoulder pain & stability",    period: "morning", order: 3, isDefault: true },
  { id: uid(), label: "Complete prescribed workout session",       period: "evening", order: 4, isDefault: true },
  { id: uid(), label: "Reach 2.5L daily hydration target",        period: "evening", order: 5, isDefault: true },
];
