import { Emotion } from "./types";

export interface EmotionPalette {
  label: string;
  description: string;
  background: string;
  accent: string;
  text: "light" | "dark";
}

export const EMOTIONS: Record<Emotion, EmotionPalette> = {
  grief: {
    label: "Grief",
    description: "for mourning what was",
    background: "#0d1b2a",
    accent: "#c0c7d1",
    text: "light",
  },
  anger: {
    label: "Anger",
    description: "for sharpened endings",
    background: "#1a1110",
    accent: "#8b1e3f",
    text: "light",
  },
  peace: {
    label: "Peace",
    description: "for quiet endings",
    background: "#f5f2ec",
    accent: "#9caf88",
    text: "dark",
  },
  regret: {
    label: "Regret",
    description: "for what stays unfinished",
    background: "#2d1b3d",
    accent: "#d4a574",
    text: "light",
  },
  nostalgia: {
    label: "Nostalgia",
    description: "for softened memory",
    background: "#e8dcc4",
    accent: "#5c4033",
    text: "dark",
  },
  relief: {
    label: "Relief",
    description: "for exhaling at last",
    background: "#d8e4ec",
    accent: "#ffffff",
    text: "dark",
  },
  longing: {
    label: "Longing",
    description: "for distance that lingers",
    background: "#3d1e1e",
    accent: "#c9a961",
    text: "light",
  },
  acceptance: {
    label: "Acceptance",
    description: "for carrying forward",
    background: "#e8e6e3",
    accent: "#1a1a1a",
    text: "dark",
  },
};

export const EMOTION_ORDER = Object.keys(EMOTIONS) as Emotion[];
