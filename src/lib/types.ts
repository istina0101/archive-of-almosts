export type Emotion =
  | "grief"
  | "anger"
  | "peace"
  | "regret"
  | "nostalgia"
  | "relief"
  | "longing"
  | "acceptance";

export type TypographyPattern =
  | "fragmented"
  | "spiral"
  | "falling"
  | "mirrored"
  | "collapse"
  | "fading"
  | "stretched"
  | "heavy";

export interface Archive {
  id: string;
  createdAt: string;
  subject: string;
  beganAt: string;
  endedAt: string;
  title: string;
  medium: string;
  origin: string;
  dimensions: string;
  story: string;
  hardestPart: string;
  whatRemains: string;
  emotion: Emotion;
  archivistNote: string;
  credit: string;
  finalWords: string;
  typographyPattern: TypographyPattern;
}
