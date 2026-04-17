import { useId } from "react";
import { TypographyPattern } from "@/lib/types";

interface PoeticTypographyProps {
  text: string;
  pattern: TypographyPattern;
  accent: string;
}

const splitStory = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

export function PoeticTypography({ text, pattern, accent }: PoeticTypographyProps) {
  const lines = splitStory(text);
  const words = text.split(/\s+/).filter(Boolean);
  const pathId = useId();
  const renderedLines = lines.length === 0 ? [text].filter(Boolean) : lines;

  if (pattern === "spiral") {
    return (
      <svg className="poetic poetic-spiral" viewBox="0 0 400 300" aria-hidden>
        <defs>
          <path
            id={pathId}
            d="M200,150 m-8,0 a8,8 0 1,1 16,0 a8,8 0 1,1 -16,0 M200,150 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 M200,150 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0 M200,150 m-58,0 a58,58 0 1,0 116,0 a58,58 0 1,0 -116,0 M200,150 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
          />
        </defs>
        <text fill={accent} fontSize="12" letterSpacing="1.5">
          <textPath href={`#${pathId}`}>{words.join(" · ")}</textPath>
        </text>
      </svg>
    );
  }

  if (pattern === "fragmented") {
    return (
      <div className="poetic poetic-fragmented" aria-hidden>
        {words.map((word, index) => {
          const rotate = ((index * 23) % 17) - 8;
          const offsetY = ((index * 13) % 11) - 5;
          return (
            <span
              key={`${word}-${index}`}
              style={{ transform: `translateY(${offsetY}px) rotate(${rotate}deg)` }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`poetic poetic-${pattern}`} aria-hidden>
      {renderedLines.map((line, index) => {
        const total = Math.max(renderedLines.length - 1, 1);
        const progress = index / total;

        if (pattern === "falling") {
          return (
            <p key={`${line}-${index}`} style={{ fontSize: `${2 - progress * 1.1}rem` }}>
              {line}
            </p>
          );
        }

        if (pattern === "mirrored") {
          return (
            <p key={`${line}-${index}`}>
              {line.split(/\s+/).map((word, wordIndex) => (
                <span
                  key={`${word}-${wordIndex}`}
                  style={{
                    display: "inline-block",
                    transform: wordIndex % 2 ? "scaleX(-1)" : "none",
                    marginRight: "0.25em",
                  }}
                >
                  {word}
                </span>
              ))}
            </p>
          );
        }

        if (pattern === "collapse") {
          return (
            <p
              key={`${line}-${index}`}
              style={{
                marginInline: `${progress * 3.5}rem`,
                letterSpacing: `${(1 - progress) * 0.14}em`,
              }}
            >
              {line}
            </p>
          );
        }

        if (pattern === "fading") {
          return (
            <p key={`${line}-${index}`} style={{ opacity: 1 - progress * 0.85 }}>
              {line}
            </p>
          );
        }

        if (pattern === "stretched") {
          return (
            <p
              key={`${line}-${index}`}
              style={{ letterSpacing: "0.45em", fontWeight: 300, marginBottom: "1.2rem" }}
            >
              {line}
            </p>
          );
        }

        // heavy
        return (
          <p key={`${line}-${index}`} style={{ letterSpacing: "-0.08em", fontWeight: 800 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}
