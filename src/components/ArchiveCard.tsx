import { EMOTIONS } from "@/lib/emotions";
import { Archive } from "@/lib/types";
import { PoeticTypography } from "./PoeticTypography";

interface ArchiveCardProps {
  archive: Archive;
  id?: string;
}

export function ArchiveCard({ archive, id }: ArchiveCardProps) {
  const palette = EMOTIONS[archive.emotion];
  const textColor = palette.text === "light" ? "#f5f5f5" : "#141414";

  return (
    <article
      id={id}
      className="archive-card"
      style={{
        backgroundColor: palette.background,
        color: textColor,
        borderColor: palette.accent,
      }}
    >
      <div className="noise-overlay" />
      <header className="archive-story" style={{ borderColor: palette.accent }}>
        {/* Visually hidden plain text for screen readers */}
        <p className="sr-only">{archive.story}</p>
        <PoeticTypography
          text={archive.story}
          pattern={archive.typographyPattern}
          accent={palette.accent}
        />
      </header>
      <section className="archive-meta">
        <h2>{archive.title}</h2>
        <p className="archive-era">
          c. {archive.beganAt} — {archive.endedAt}
        </p>
        <dl>
          <dt>Medium</dt>
          <dd>{archive.medium}</dd>
          <dt>Origin</dt>
          <dd>{archive.origin}</dd>
          <dt>Dimensions</dt>
          <dd>{archive.dimensions}</dd>
          <dt>Donor</dt>
          <dd>{archive.credit}</dd>
        </dl>
        <div className="archive-divider" style={{ backgroundColor: palette.accent }} />
        <h3>Archivist&apos;s Note</h3>
        <p>{archive.archivistNote}</p>
        {archive.finalWords ? (
          <>
            <div className="archive-divider" style={{ backgroundColor: palette.accent }} />
            <p>{archive.finalWords}</p>
          </>
        ) : null}
        <p className="archive-filed">
          Filed on {new Date(archive.createdAt).toLocaleDateString()}
        </p>
      </section>
    </article>
  );
}
