"use client";

import html2canvas from "html2canvas";
import Link from "next/link";
import { useState } from "react";
import { ArchiveCard } from "@/components/ArchiveCard";
import { hasSeenWarning, markWarningSeen, readArchives, removeArchive } from "@/lib/storage";
import { Archive } from "@/lib/types";

const html2canvasOptions = { backgroundColor: null, scale: 2 };

export default function CollectionPage() {
  const [archives, setArchives] = useState<Archive[]>(() =>
    typeof window === "undefined" ? [] : readArchives()
  );
  const [showWarning] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const shouldShow = !hasSeenWarning();
    if (shouldShow) {
      markWarningSeen();
    }
    return shouldShow;
  });

  const refresh = () => setArchives(readArchives());

  const onDelete = (id: string) => {
    if (!window.confirm("Delete this archived almost?")) {
      return;
    }
    removeArchive(id);
    refresh();
  };

  const onDownload = async (id: string) => {
    const element = document.getElementById(`archive-${id}`);
    if (!element) {
      return;
    }

    try {
      const canvas = await html2canvas(element, html2canvasOptions);
      const link = document.createElement("a");
      link.download = `archive-${id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      window.alert("Could not prepare this archive card for download.");
    }
  };

  const onExportJson = () => {
    const blob = new Blob([JSON.stringify(archives, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "archive-of-almosts-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="collection-shell">
      <h1>Your archive</h1>
      <p className="statement">Wander quietly through what you have filed.</p>
      <div className="flow-actions">
        <Link href="/archive/new" className="quiet-button primary">
          File an Almost
        </Link>
        <button
          type="button"
          className="quiet-button"
          onClick={onExportJson}
          disabled={archives.length === 0}
        >
          Export JSON backup
        </button>
      </div>

      {showWarning ? (
        <p className="warning">
          This archive lives on this device only. Clearing your browser will clear the archive.
        </p>
      ) : null}

      {archives.length === 0 ? (
        <p className="empty-state">No almosts have been filed yet.</p>
      ) : (
        <section className="collection-grid">
          {archives.map((archive) => (
            <article key={archive.id} className="collection-card">
              <ArchiveCard archive={archive} id={`archive-${archive.id}`} />
              <div className="flow-actions" style={{ justifyContent: "flex-start" }}>
                <Link href={`/collection/${archive.id}`} className="quiet-button">
                  Open full card
                </Link>
                <button
                  type="button"
                  className="quiet-button"
                  onClick={() => onDownload(archive.id)}
                >
                  Download as PNG
                </button>
                <button
                  type="button"
                  className="quiet-button"
                  onClick={() => onDelete(archive.id)}
                >
                  Delete from archive
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
