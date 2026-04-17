"use client";

import { KeyboardEvent } from "react";
import { EMOTIONS, EMOTION_ORDER } from "@/lib/emotions";
import { Emotion } from "@/lib/types";

interface EmotionSelectorProps {
  value: Emotion;
  onChange: (emotion: Emotion) => void;
}

export function EmotionSelector({ value, onChange }: EmotionSelectorProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    event.preventDefault();
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const nextIndex = (index + delta + EMOTION_ORDER.length) % EMOTION_ORDER.length;
    onChange(EMOTION_ORDER[nextIndex]);

    const next = document.querySelector<HTMLButtonElement>(
      `[data-emotion='${EMOTION_ORDER[nextIndex]}']`
    );
    next?.focus();
  };

  return (
    <div className="emotion-grid" role="radiogroup" aria-label="Choose emotion">
      {EMOTION_ORDER.map((emotion, index) => {
        const palette = EMOTIONS[emotion];
        const selected = emotion === value;

        return (
          <button
            key={emotion}
            type="button"
            className={`emotion-option${selected ? " selected" : ""}`}
            aria-checked={selected}
            role="radio"
            data-emotion={emotion}
            onClick={() => onChange(emotion)}
            onKeyDown={(event) => onKeyDown(event, index)}
            style={{
              backgroundColor: palette.background,
              color: palette.text === "light" ? "#f8f8f8" : "#161616",
              borderColor: selected ? palette.accent : "transparent",
            }}
          >
            <span>{palette.label}</span>
            <small>{palette.description}</small>
          </button>
        );
      })}
    </div>
  );
}
